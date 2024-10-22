// models/Property.js
const mongoose = require("mongoose");

// Property Schema
const propertySchema = new mongoose.Schema({
  propertyId: { type: Number, unique: true }, // Auto-incrementing ID
  fullName: String,
  addressLine1: String,
  city: String,
  state: String,
  country: String,
  email: String,
  contact: String,
  propertyName: String,
  description: String,
  amenities: String,
  tokens: Number,
  images: [Buffer], // Store image data as binary (Buffer)
});

// Create Property model
const Property = mongoose.model("Property", propertySchema);

// Counter Schema for auto-incrementing property ID
const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});

// Create Counter model
const Counter = mongoose.model("Counter", counterSchema);

module.exports = { Property, Counter };
