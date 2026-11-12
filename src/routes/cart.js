const router = require("express").Router();
const prisma = require("../lib-prisma");
const { requireAuth } = require("../middleware-auth");

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
    res.json(cart);
  } catch (e) { next(e); }
});

router.post("/items", async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: Number(productId) },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Number(quantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: Number(productId), quantity: Number(quantity) },
      });
    }
    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
    res.json(updated);
  } catch (e) { next(e); }
});

router.put("/items/:itemId", async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: Number(req.params.itemId) } });
    } else {
      await prisma.cartItem.update({
        where: { id: Number(req.params.itemId) },
        data: { quantity: Number(quantity) },
      });
    }
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    res.json(cart);
  } catch (e) { next(e); }
});

router.delete("/items/:itemId", async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: Number(req.params.itemId) } });
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    res.json(cart);
  } catch (e) { next(e); }
});

module.exports = router;