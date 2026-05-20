const { sendContactEmail } = require('../utils/email');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, name, email, phone, subject, message } = req.body;
    const fullName = name || [firstName, lastName].filter(Boolean).join(' ').trim();

    // Validation
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!process.env.ADMIN_EMAIL) {
      return res.status(500).json({
        success: false,
        message: 'Contact email is not configured',
      });
    }

    // Send email
    await sendContactEmail({
      name: fullName,
      email,
      phone,
      subject: subject || 'Website contact form submission',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
};

module.exports = { submitContact };
