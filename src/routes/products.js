const router = require("express").Router();
const prisma = require("../lib-prisma");
const { requireAuth, requireAdmin } = require("../middleware-auth");

// Public: list products (search + category filter)
router.get("/", async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const where = {};
    if (search) where.name = { contains: search };
    if (category) where.category = { name: category };

    const products = await prisma.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy: { id: "desc" },
    });
    res.json(products);
  } catch (e) { next(e); }
});

// Public: get single product
router.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { images: true, category: true, reviews: { include: { user: true } } },
    });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (e) { next(e); }
});

// Admin: create product
router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, price, stock, categoryId, images } = req.body;
    const product = await prisma.product.create({
      data: {
        name, description,
        price: Number(price),
        stock: Number(stock || 0),
        categoryId: categoryId ? Number(categoryId) : null,
        images: images?.length ? { create: images.map((url) => ({ url })) } : undefined,
      },
      include: { images: true },
    });
    res.json(product);
  } catch (e) { next(e); }
});

module.exports = router;