// Run with: node utils/seedProducts.js
// Populates the database with sample Veloura products for local development/demo.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const Product = require("../models/Product");

const sampleProducts = [
  {
    name: "Silk Repair Shampoo",
    nameAr: "شامبو الحرير للإصلاح",
    description: "A sulfate-free shampoo that gently cleanses while repairing damaged strands.",
    descriptionAr: "شامبو خالٍ من الكبريتات ينظف بلطف مع إصلاح الشعر التالف.",
    price: 24.99,
    oldPrice: 29.99,
    category: "Shampoo",
    image: "https://images.unsplash.com/photo-1585232004423-3e14f4306e0f?w=600",
    stock: 40,
    rating: 4.6,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Velvet Hydration Conditioner",
    nameAr: "بلسم فيلفيت للترطيب",
    description: "Deeply hydrates and softens hair, leaving it smooth and manageable.",
    descriptionAr: "يرطب الشعر بعمق ويجعله ناعماً وسهل التصفيف.",
    price: 22.5,
    category: "Conditioner",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600",
    stock: 35,
    rating: 4.4,
    isFeatured: true,
  },
  {
    name: "Golden Argan Hair Oil",
    nameAr: "زيت الأرغان الذهبي للشعر",
    description: "Pure argan oil blend that nourishes and adds brilliant shine.",
    descriptionAr: "مزيج من زيت الأرغان النقي يغذي الشعر ويمنحه لمعاناً رائعاً.",
    price: 32.0,
    oldPrice: 38.0,
    category: "Hair Oils",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600",
    stock: 25,
    rating: 4.8,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    name: "Intensive Repair Hair Mask",
    nameAr: "قناع الشعر للإصلاح المكثف",
    description: "A weekly treatment mask that restores strength to over-processed hair.",
    descriptionAr: "قناع أسبوعي يعيد القوة للشعر المتضرر من العلاجات الكيميائية.",
    price: 28.75,
    category: "Hair Masks",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600",
    stock: 20,
    rating: 4.5,
  },
  {
    name: "Rose Petal Styling Cream",
    nameAr: "كريم التصفيف بالورد",
    description: "Lightweight cream for frizz control and a natural, glossy finish.",
    descriptionAr: "كريم خفيف للسيطرة على التجعد مع لمسة نهائية لامعة وطبيعية.",
    price: 19.99,
    category: "Hair Creams",
    image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600",
    stock: 30,
    rating: 4.2,
  },
  {
    name: "Radiant Shine Hair Serum",
    nameAr: "سيروم الشعر اللامع",
    description: "A few drops instantly tame flyaways and boost shine.",
    descriptionAr: "بضع قطرات تروض الشعر المتطاير فوراً وتزيد من لمعانه.",
    price: 26.0,
    category: "Hair Serums",
    image: "https://images.unsplash.com/photo-1610113025603-92e0af88a55c?w=600",
    stock: 18,
    rating: 4.7,
    isBestSeller: true,
  },
  {
    name: "Sculpt & Hold Styling Gel",
    nameAr: "جل تصفيف بثبات قوي",
    description: "Strong-hold gel for sleek, long-lasting styles without stiffness.",
    descriptionAr: "جل بثبات قوي لتسريحات أنيقة وطويلة الأمد دون تصلب.",
    price: 15.5,
    category: "Hair Styling",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600",
    stock: 45,
    rating: 4.1,
  },
  {
    name: "Pearl Hair Clip Set",
    nameAr: "طقم مشابك شعر باللؤلؤ",
    description: "Elegant pearl-embellished clips, a delicate finishing touch for any look.",
    descriptionAr: "مشابك أنيقة مزينة باللؤلؤ، لمسة نهائية رقيقة لأي إطلالة.",
    price: 12.0,
    category: "Hair Accessories",
    image: "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=600",
    stock: 60,
    rating: 4.3,
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} products.`);
  } catch (error) {
    console.error("Failed to seed products:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
