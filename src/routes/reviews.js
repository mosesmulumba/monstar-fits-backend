const router = require("express").Router();
const prisma = require("../lib-prisma");
const { requireAuth } = require("../middleware-auth");

router.get("/product/:productId", async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: Number(req.params.productId) },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (e) { next(e); }
});

router.post("/product/:productId", requireAuth, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: Number(req.params.productId),
        },
      },
      update: { rating: Number(rating), comment },
      create: {
        userId: req.user.id,
        productId: Number(req.params.productId),
        rating: Number(rating),
        comment,
      },
    });
    res.json(review);
  } catch (e) { next(e); }
});

module.exports = router;