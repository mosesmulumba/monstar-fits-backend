const router = require("express").Router();
const prisma = require("../lib-prisma");
const { requireAuth } = require("../middleware-auth");

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: { include: { images: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const { shippingAddress, couponCode } = req.body;
    if (!shippingAddress) return res.status(400).json({ error: "Address required" });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    // Check stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity)
        return res.status(400).json({ error: `Not enough stock for ${item.product.name}` });
    }

    // Coupon
    let coupon = null;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon || new Date(coupon.expiresAt) < new Date())
        return res.status(400).json({ error: "Invalid or expired coupon" });
    }

    // Calculate total
    const subtotal = cart.items.reduce(
      (s, i) => s + Number(i.product.price) * i.quantity, 0
    );
    let total = subtotal;
    if (coupon) {
      total = coupon.isPercent
        ? subtotal * (1 - Number(coupon.discount) / 100)
        : subtotal - Number(coupon.discount);
      if (total < 0) total = 0;
    }

    // Transaction: create order + items + decrement stock + clear cart
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: req.user.id,
          total: Number(total.toFixed(2)),
          shippingAddress,
          couponId: coupon?.id || null,
          items: {
            create: cart.items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.product.price,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });

    res.json(order);
  } catch (e) { next(e); }
});

module.exports = router;