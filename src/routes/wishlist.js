const router = require("express").Router();
const prisma = require("../lib-prisma");
const { requireAuth } = require("../middleware-auth");

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { images: true } } },
    });
    res.json(items);
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const { productId } = req.body;
    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId: Number(productId) } },
      update: {},
      create: { userId: req.user.id, productId: Number(productId) },
    });
    res.json(item);
  } catch (e) { next(e); }
});

router.delete("/:productId", async (req, res, next) => {
  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: req.user.id, productId: Number(req.params.productId) },
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;