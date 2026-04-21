import React, { useState } from 'react';
import { API_URL } from '../config/api';

const Add = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'mudgar',
    weights: [''],
  });

  const [priceMap, setPriceMap] = useState({ '': '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['mudgar', 'gada', 'samtola', 'senaboard'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleWeightChange = (index, value) => {
    const newWeights = [...formData.weights];
    const oldWeight = newWeights[index];
    newWeights[index] = value;
    setFormData({ ...formData, weights: newWeights });

    // Update priceMap keys
    const newPriceMap = { ...priceMap };
    delete newPriceMap[oldWeight];
    newPriceMap[value] = priceMap[oldWeight] || '';
    setPriceMap(newPriceMap);
  };

  const addWeightField = () => {
    setFormData({ ...formData, weights: [...formData.weights, ''] });
  };

  const removeWeightField = (index) => {
    const weightToRemove = formData.weights[index];
    const newWeights = formData.weights.filter((_, i) => i !== index);
    setFormData({ ...formData, weights: newWeights });

    const newPriceMap = { ...priceMap };
    delete newPriceMap[weightToRemove];
    setPriceMap(newPriceMap);
  };

  const handlePriceChange = (weight, price) => {
    setPriceMap({ ...priceMap, [weight]: price });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login as admin to add products');
      }

      // Filter out empty weights and build pricePerWeight object
      const validWeights = formData.weights.filter((w) => w.trim() !== '');
      const pricePerWeight = {};
      validWeights.forEach((weight) => {
        if (priceMap[weight]) {
          pricePerWeight[weight] = Number(priceMap[weight]);
        }
      });

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('weights', JSON.stringify(validWeights));
      submitData.append('pricePerWeight', JSON.stringify(pricePerWeight));
      if (image) {
        submitData.append('image', image);
      }

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      setMessage({ type: 'success', text: 'Product added successfully!' });

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'mudgar',
        weights: [''],
      });
      setPriceMap({ '': '' });
      setImage(null);
      setImagePreview('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5C3A21] mb-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>
          Add New Product
        </h1>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none resize-none"
              placeholder="Enter product description"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Product Image *</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5C3A21] file:text-white hover:file:bg-[#4a2e1a]"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Weights and Prices */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-gray-700 font-medium">Available Weights & Prices *</label>
              <button
                type="button"
                onClick={addWeightField}
                className="px-4 py-2 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4a2e1a] transition text-sm"
              >
                + Add Weight
              </button>
            </div>

            <div className="space-y-3">
              {formData.weights.map((weight, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="e.g., 5kg"
                    value={weight}
                    onChange={(e) => handleWeightChange(index, e.target.value)}
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Price (Rs.)"
                    value={priceMap[weight] || ''}
                    onChange={(e) => handlePriceChange(weight, e.target.value)}
                    required
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                  />
                  {formData.weights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWeightField(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Example: Weight "5kg" with Price "500" will show as Rs. 500 for 5kg variant
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#5C3A21] text-white font-semibold rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;

