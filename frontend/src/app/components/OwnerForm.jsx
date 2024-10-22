"use client";
import { useState } from "react";

const OwnerForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    state: "",
    country: "",
    email: "",
    contact: "",
    propertyName: "",
    description: "",
    amenities: "",
    tokens: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files,
    });

    // Create image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic, e.g., send data to server
    console.log(formData);
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("addressLine1", formData.addressLine1);
    data.append("city", formData.city);
    data.append("state", formData.state);
    data.append("country", formData.country);
    data.append("email", formData.email);
    data.append("contact", formData.contact);
    data.append("propertyName", formData.propertyName);
    data.append("description", formData.description);
    data.append("amenities", formData.amenities);
    data.append("tokens", formData.tokens);

    // Append multiple images
    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]);
    }
    try {
      const response = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Property submitted successfully!");
      } else {
        alert("Failed to submit property.");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("An error occurred while uploading the property.");
    }
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  };

  const getSubmittedData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/properties");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address Line 1:</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contact:</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Property Name:</label>
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amenities Provided:</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Total Tokens to Divide Property In:</label>
          <input
            type="number"
            name="tokens"
            value={formData.tokens}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Upload Images:</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            required
          />
        </div>

        {/* Display Image Previews */}
        {imagePreviews.length > 0 && (
          <div>
            <h4>Image Previews:</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <button type="submit">Submit</button>
      </form>

      <button onClick={getSubmittedData}>GetData</button>
    </>
  );
};

export default OwnerForm;
