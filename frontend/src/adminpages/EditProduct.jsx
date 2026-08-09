import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI, adminAPI } from '../config/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: null,
    weights: [],
    pricePerWeight: {},
    isActive: true,
  });
  
  const [weightInput, setWeightInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        if (response.success) {
          const product = response.data;
          // Handle pricePerWeight (could be Map or plain object from JSON)
          const priceMap = {};
          if (product.pricePerWeight) {
            if (typeof product.pricePerWeight.forEach === 'function') {
              // It's a Map
              product.pricePerWeight.forEach((price, weight) => {
                priceMap[weight] = price;
              });
            } else {
              // It's a plain object from JSON
              Object.entries(product.pricePerWeight).forEach(([weight, price]) => {
                priceMap[weight] = price;
              });
            }
          }
          
          setFormData({
            name: product.name || '',
            description: product.description || '',
            category: product.category || '',
            image: null,
            weights: product.weights || [],
            pricePerWeight: priceMap,
            isActive: product.isActive !== false,
          });
          setImagePreview(product.image);
          setOriginalImage(product.image);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addWeight = () => {
    if (weightInput.trim() && !formData.weights.includes(weightInput.trim())) {
      setFormData({
        ...formData,
        weights: [...formData.weights, weightInput.trim()],
      });
      setWeightInput('');
    }
  };

  const removeWeight = (weightToRemove) => {
    const newWeights = formData.weights.filter(w => w !== weightToRemove);
    const newPricePerWeight = { ...formData.pricePerWeight };
    delete newPricePerWeight[weightToRemove];
    
    setFormData({
      ...formData,
      weights: newWeights,
      pricePerWeight: newPricePerWeight,
    });
  };

  const handlePriceChange = (weight, price) => {
    setFormData({
      ...formData,
      pricePerWeight: {
        ...formData.pricePerWeight,
        [weight]: parseFloat(price) || 0,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        weights: formData.weights,
        pricePerWeight: formData.pricePerWeight,
        isActive: formData.isActive,
      };

      // Only include image if changed
      if (formData.image) {
        // For image upload, we'd need to upload to Cloudinary first
        // For simplicity, showing a message that direct image upload needs handling
        // In real implementation, you'd upload to Cloudinary here
        alert('Image changes require re-upload. Please use the Add Product flow for image updates.');
        setSaving(false);
        return;
      }

      const response = await adminAPI.updateProduct(id, updateData);
      
      if (response.success) {
        setSuccess('Product updated successfully!');
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C3A21]"></div>
      </div>
    );
  }

  return (
    <div>
            <div className='h-20'></div>

      <div className="mb-6">
        <Link to="/admin/products" className="text-[#5C3A21] hover:underline text-sm">
          ← Back to Products
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Product</h1>
      <p className="text-gray-600 mb-6">Update product details below</p>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-4xl">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
            >
              <option value="">Select category</option>
              <option value="mudgar">Mudgar</option>
              <option value="gada">Gada</option>
              <option value="samtola">Samtola</option>
              <option value="senaboard">Sena Board</option>
              <option value="clubs">Clubs</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none resize-none"
            placeholder="Enter product description"
          />
        </div>

        {/* Weights Management */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Weights *
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
              placeholder="e.g., 2kg, 4kg, 6kg"
            />
            <button
              type="button"
              onClick={addWeight}
              className="px-4 py-2 bg-[#5C3A21] text-white rounded-lg hover:bg-[#4a2e1a] transition"
            >
              Add
            </button>
          </div>
          
          {formData.weights.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.weights.map((weight) => (
                <span
                  key={weight}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {weight}
                  <button
                    type="button"
                    onClick={() => removeWeight(weight)}
                    className="ml-2 text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Price per weight */}
          {formData.weights.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Set Prices</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.weights.map((weight) => (
                  <div key={weight}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {weight} Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.pricePerWeight[weight] || ''}
                      onChange={(e) => handlePriceChange(weight, e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C3A21] focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-[#5C3A21] border-gray-300 rounded focus:ring-[#5C3A21]"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Product is active (visible to customers)
            </span>
          </label>
        </div>

        {/* Image Preview */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Image
          </label>
          <div className="flex items-center gap-4">
            <img
              src={imagePreview}
              alt="Product preview"
              className="h-32 w-32 object-cover rounded-lg border border-gray-200"
            />
            <div className="text-sm text-gray-500">
              <p>To change image, please delete and re-add product</p>
              <p className="text-xs mt-1">(Image upload requires Cloudinary handling)</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#5C3A21] text-white font-medium rounded-lg hover:bg-[#4a2e1a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
