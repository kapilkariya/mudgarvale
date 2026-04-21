const Address = require('../models/Address');

// @desc    Add new address (max 2 per user)
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { name, email, phone, address, city, state, pincode, isDefault } = req.body;
    const userId = req.user.id;

    // Check if user already has 2 addresses
    const canAdd = await Address.canAddAddress(userId);
    if (!canAdd) {
      return res.status(400).json({
        success: false,
        message: 'You can only save up to 2 addresses. Please delete an existing address to add a new one.',
      });
    }

    // If this is set as default, unset any existing default
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    // Create address
    const newAddress = await Address.create({
      userId,
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: newAddress,
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
    });
  }
};

// @desc    Get user's addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    await Address.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
    });
  }
};

// @desc    Set address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Check if address belongs to user
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Unset all other default addresses
    await Address.updateMany({ userId }, { isDefault: false });

    // Set this as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated',
      data: address,
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update default address',
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  deleteAddress,
  setDefaultAddress,
};
