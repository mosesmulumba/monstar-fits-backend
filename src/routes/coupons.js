const router = require("express").Router();
const prisma = require("../lib-prisma");
const { requireAuth, requireAdmin } = require("../middleware-auth");

router.post("/validate", requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || new Date(coupon.expiresAt) < new Date())
      return res.status(400).json({ error: "Invalid or expired coupon" });
    res.json(coupon);
  } catch (e) { next(e); }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { code, discount, isPercent, expiresAt } = req.body;
    const coupon = await prisma.coupon.create({
      data: { code, discount, isPercent: !!isPercent, expiresAt: new Date(expiresAt) },
    });
    res.json(coupon);
  } catch (e) { next(e); }
});

module.exports = router;