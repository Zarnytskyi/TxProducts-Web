import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import Service from "../models/Service.js";

const services = [
  {
    name: "Water Quality Analysis",
    description: "Full chemical and microbiological analysis of water samples.",
    price: 149,
    turnaround: "3-5 business days",
    isActive: true,
  },
  {
    name: "Soil Composition Analysis",
    description: "Detailed analysis of soil nutrients, pH, and contaminants.",
    price: 199,
    turnaround: "5-7 business days",
    isActive: true,
  },
  {
    name: "Air Quality Testing",
    description: "Measurement of pollutants, particulates, and VOCs in air samples.",
    price: 249,
    turnaround: "2-3 business days",
    isActive: true,
  },
  {
    name: "Food Safety Testing",
    description: "Microbiological and chemical safety testing for food products.",
    price: 179,
    turnaround: "4-6 business days",
    isActive: false,
  },
];

const seed = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("Seed is not allowed in production");
    process.exit(1);
  }

  await mongoose.connect(ENV.MONGO_URI);
  console.log("Connected to MongoDB");

  await Service.deleteMany({});
  console.log("Cleared existing services");

  await Service.insertMany(services);
  console.log(`Seeded ${services.length} services`);

  await mongoose.disconnect();
  console.log("Done");
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});