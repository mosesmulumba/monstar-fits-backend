const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categoryNames = [
  "Outerwear",
  "Tops",
  "Bottoms",
  "Dresses",
  "Shoes",
  "Accessories",
  "Activewear",
  "Formal",
  "Luxury",
  "Streetwear",
];

const firstNames = [
  "Ava", "Liam", "Noah", "Emma", "Mila", "Ethan", "Olivia", "Lucas", "Sophia", "Mason",
  "Isabella", "Logan", "Charlotte", "Jackson", "Amelia", "Leo", "Harper", "Henry", "Ella", "James",
  "Grace", "Daniel", "Chloe", "Benjamin", "Zoe", "Samuel", "Nora", "Alexander", "Lily", "David",
  "Scarlett", "Michael", "Aria", "Elijah", "Layla", "Sebastian", "Hannah", "Mateo", "Leah", "Isaac",
  "Avery", "Theodore", "Aurora", "Julian", "Sadie", "Wyatt", "Naomi", "Nathan", "Elena", "Owen",
  "Ruby", "Gabriel", "Claire", "Eli", "Paisley", "Jack", "Hazel", "Leo", "Sienna", "Thomas",
  "Julia", "Hudson", "Lucy", "Asher", "Maya", "Aaron", "Ivy", "Easton", "Violet", "Adrian",
  "Delilah",
];

const lastNames = [
  "Taylor", "Brooks", "Morgan", "Reed", "Bennett", "Parker", "Cooper", "Hill", "Ward", "Price",
  "Turner", "Foster", "Ross", "Baker", "Carter", "Nguyen", "Kim", "Patel", "Murphy", "Diaz",
  "Walker", "Hayes", "Hughes", "Flores", "Scott", "Gonzalez", "Bell", "Gray", "Russell", "Cruz",
  "Rivera", "Ortiz", "Powell", "James", "Bishop", "Fisher", "Knight", "Webster", "Nolan", "Stone",
  "Bellamy", "Crawford", "Shaw", "Hawkins", "Hansen", "Walters", "Mills", "Ellis", "Coleman", "Simmons",
];

const fashionWords = [
  "Velvet", "Monarch", "Drift", "Luna", "Harbor", "Atlas", "Summit", "Cinder", "Nova", "Blaze",
  "South", "North", "Satin", "Canvas", "Metro", "Silver", "Copper", "Cloud", "Milano", "Aster",
  "Cobalt", "Oak", "Emerald", "Dune", "Fable", "Mosaic", "Bloom", "Echo", "Horizon", "Rivet",
];

const productTypes = [
  "Hoodie", "Jacket", "Blazer", "Tee", "Shirt", "Polo", "Sneaker", "Boot", "Trouser", "Jeans",
  "Skirt", "Dress", "Coat", "Sweater", "Puffer", "Bag", "Watch", "Sandal", "Belt", "Cap",
  "Scarf", "Purse", "Loafers", "Shorts", "Set", "Cardigan", "Robe", "Candle", "Perfume",
];

const cityData = [
  { city: "New York", state: "NY", country: "USA" },
  { city: "Chicago", state: "IL", country: "USA" },
  { city: "Los Angeles", state: "CA", country: "USA" },
  { city: "Miami", state: "FL", country: "USA" },
  { city: "Seattle", state: "WA", country: "USA" },
  { city: "Austin", state: "TX", country: "USA" },
  { city: "London", state: "England", country: "UK" },
  { city: "Paris", state: "Île-de-France", country: "France" },
  { city: "Berlin", state: "Berlin", country: "Germany" },
  { city: "Tokyo", state: "Tokyo", country: "Japan" },
  { city: "Toronto", state: "Ontario", country: "Canada" },
  { city: "Sydney", state: "NSW", country: "Australia" },
];

const reviewComments = [
  "Excellent fit and premium feel. I would definitely buy again.",
  "The material feels luxurious and the styling is on point.",
  "Perfect for everyday wear and very comfortable.",
  "A little pricey, but the quality makes it worth it.",
  "The color is even better in person, and the finish is polished.",
  "Love the silhouette and the details. It elevates my wardrobe instantly.",
  "Very soft and flattering. I get compliments every time I wear it.",
  "Clean design and excellent craftsmanship. Highly recommended.",
  "A great staple piece for both casual and dressier looks.",
  "The product looks even better than the photos and feels premium.",
];

const productImages = [
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
  "https://images.unsplash.com/photo-1529138192225-7a7d4a72d6ba?w=900",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900",
  "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=900",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900",
  "https://images.unsplash.com/photo-1521104964835-1b9fecb3f0b1?w=900",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900",
  "https://images.unsplash.com/photo-1529138192225-7a7d4a72d6ba?w=900",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
];

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createCategories() {
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

async function createAdmin() {
  const email = "admin@monstarfits.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: "Monstar Admin",
        role: "ADMIN",
      },
    });
  }
}

async function createUsers() {
  const createdUsers = [];
  const passwordHash = await bcrypt.hash("Password123!", 10);

  for (let i = 1; i <= 50; i += 1) {
    const firstName = firstNames[(i * 3) % firstNames.length];
    const lastName = lastNames[(i * 5) % lastNames.length];
    const email = `user${i}@monstarfits.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        name: `${firstName} ${lastName}`,
        role: "CUSTOMER",
      },
    });
    createdUsers.push(user);
  }

  return createdUsers;
}

async function createAddresses(users) {
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const cityItem = cityData[i % cityData.length];
    const allAddresses = [
      {
        line1: `${randomInt(12, 999)} ${randomChoice(["Main", "Park", "Oak", "Cedar", "Maple", "Willow", "Elm", "Pine"]) } Street`,
        city: cityItem.city,
        state: cityItem.state,
        postalCode: String(randomInt(10000, 99999)),
        country: cityItem.country,
        isDefault: true,
      },
      {
        line1: `${randomInt(12, 999)} ${randomChoice(["Market", "Hill", "Broadway", "Lakeside", "Sunset", "Birch"]) } Ave`,
        city: cityData[(i + 3) % cityData.length].city,
        state: cityData[(i + 3) % cityData.length].state,
        postalCode: String(randomInt(10000, 99999)),
        country: cityData[(i + 3) % cityData.length].country,
        isDefault: false,
      },
    ];

    for (const address of allAddresses) {
      await prisma.address.create({
        data: {
          userId: user.id,
          line1: address.line1,
          line2: i % 2 === 0 ? "Apt " + randomInt(1, 45) : null,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          isDefault: address.isDefault,
        },
      });
    }
  }
}

async function createCoupons() {
  const coupons = [
    { code: "WELCOME10", discount: 10, isPercent: true, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90) },
    { code: "STYLES15", discount: 15, isPercent: true, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120) },
    { code: "VIP20", discount: 20, isPercent: true, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 150) },
    { code: "BUNDLE30", discount: 30, isPercent: true, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180) },
    { code: "SAVE50", discount: 50, isPercent: true, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 210) },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
  }
}

async function createProducts() {
  const categoryMap = await prisma.category.findMany();
  const productMap = new Map(categoryMap.map((category) => [category.name, category.id]));

  const createdProducts = [];

  for (let i = 1; i <= 120; i += 1) {
    const categoryName = categoryMap[i % categoryMap.length].name;
    const adjective = randomChoice(fashionWords);
    const productType = randomChoice(productTypes);
    const productName = `${adjective} ${productType} ${i}`;
    const description = "A modern essential designed for comfort, movement, and elevated everyday style.";
    const price = Number((randomInt(45, 280) + Math.random()).toFixed(2));
    const stock = randomInt(12, 120);

    const existing = await prisma.product.findFirst({ where: { name: productName } });
    if (existing) continue;

    const product = await prisma.product.create({
      data: {
        name: productName,
        description,
        price,
        stock,
        categoryId: productMap[categoryName],
        images: {
          createMany: {
            data: Array.from({ length: randomInt(2, 4) }, (_, idx) => ({
              url: `${productImages[(i + idx) % productImages.length]}?auto=format&fit=crop&w=900&q=80`,
            })),
          },
        },
      },
      include: { images: true },
    });

    createdProducts.push(product);
  }

  return createdProducts;
}

async function createWishlistItems(users, products) {
  const rows = [];

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const selectedProducts = [...products].sort(() => Math.random() - 0.5).slice(0, randomInt(3, 8));

    for (const product of selectedProducts) {
      rows.push({ userId: user.id, productId: product.id });
    }
  }

  await prisma.wishlistItem.createMany({
    data: rows,
    skipDuplicates: true,
  });
}

async function createReviews(users, products) {
  const rows = [];

  for (const product of products) {
    const reviewers = [...users].sort(() => Math.random() - 0.5).slice(0, randomInt(3, 10));

    for (const reviewer of reviewers) {
      rows.push({
        userId: reviewer.id,
        productId: product.id,
        rating: randomInt(3, 5),
        comment: randomChoice(reviewComments),
      });
    }
  }

  await prisma.review.createMany({
    data: rows,
    skipDuplicates: true,
  });
}

async function createOrders(users, products) {
  const couponList = await prisma.coupon.findMany();
  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  for (let i = 0; i < 40; i += 1) {
    const user = users[i % users.length];
    const shippingAddress = await prisma.address.findFirst({
      where: { userId: user.id, isDefault: true },
      orderBy: { id: "asc" },
    });

    const itemCount = randomInt(1, 4);
    const selectedProducts = [...products].sort(() => Math.random() - 0.5).slice(0, itemCount);
    const orderItems = selectedProducts.map((product) => ({
      productId: product.id,
      quantity: randomInt(1, 3),
      price: product.price,
    }));

    const subtotal = orderItems.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    const coupon = couponList[i % couponList.length];
    const discountAmount = coupon && coupon.isPercent ? subtotal * (coupon.discount / 100) : 0;
    const total = Number((subtotal - discountAmount).toFixed(2));

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: statuses[i % statuses.length],
        total,
        shippingAddress: shippingAddress
          ? `${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.country}`
          : "No address provided",
        couponId: coupon ? coupon.id : null,
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    if (order) {
      console.log(`Created order ${order.id} for ${user.email}`);
    }
  }
}

async function main() {
  await createCategories();
  await createAdmin();
  const users = await createUsers();
  await createAddresses(users);
  await createCoupons();
  const products = await createProducts();
  await createWishlistItems(users, products);
  await createReviews(users, products);
  await createOrders(users, products);

  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const reviewCount = await prisma.review.count();
  const wishlistCount = await prisma.wishlistItem.count();
  const orderCount = await prisma.order.count();

  console.log("✅ Seed complete");
  console.log(JSON.stringify({
    userCount,
    productCount,
    categoryCount,
    reviewCount,
    wishlistCount,
    orderCount,
  }, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });