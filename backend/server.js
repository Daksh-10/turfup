const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { Property } = require("./models/Property");
const getNextSequenceValue = require("./utils/counter");

// Initialize Express
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/propertyDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Set up Multer for file upload (Store image as a buffer in memory)
const storage = multer.memoryStorage(); // Store in memory as Buffer
const upload = multer({ storage });

// Route to store property data
app.post("/api/properties", upload.array("images", 5), async (req, res) => {
  try {
    // Prepare image buffers
    const imageBuffers = req.files.map((file) => file.buffer);

    // Get the next auto-incremented property ID
    const propertyId = await getNextSequenceValue("propertyId");

    // Create new property document
    const newProperty = new Property({
      propertyId: propertyId, // Assign auto-incrementing ID
      fullName: req.body.fullName,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      email: req.body.email,
      contact: req.body.contact,
      propertyName: req.body.propertyName,
      description: req.body.description,
      amenities: req.body.amenities,
      tokens: req.body.tokens,
      images: imageBuffers, // Save image data in MongoDB
    });

    // Save to MongoDB
    await newProperty.save();
    res
      .status(201)
      .json({ message: "Property created successfully", propertyId });
  } catch (error) {
    console.error("Error saving property:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get property data by ID
app.get("/api/properties/:id", async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const property = await Property.findOne(
      { propertyId },
      "propertyName description images city state country  tokens"
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Prepare the response with image data as base64
    const propertyData = {
      name: property.propertyName,
      description: property.description,
      images: property.images.map((imgBuffer) => imgBuffer.toString("base64")), // Convert image Buffer to base64 for easier transfer
      attributes: [
        { trait_type: "city", value: property.city },
        { trait_type: "state", value: property.state },
        { trait_type: "country", value: property.country },
        { trait_type: "tokens", value: property.tokens },
      ],
    };

    res.status(200).json(propertyData);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
