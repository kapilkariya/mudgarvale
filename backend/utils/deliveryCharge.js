const HEAVY_PRODUCT_CATEGORIES = ['gada', 'samtola'];
const DEFAULT_DELIVERY_CHARGE = 200;
const HEAVY_PRODUCT_DELIVERY_CHARGE = 400;
const FREE_DELIVERY_THRESHOLD = 3000;

const normalizeCategory = (category = '') => String(category).trim().toLowerCase();

const hasHeavyProduct = (items = []) =>
  items.some((item) => HEAVY_PRODUCT_CATEGORIES.includes(normalizeCategory(item.category)));

const calculateSubtotal = (items = []) =>
  items.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

// Delivery charge rules:
// 1) Subtotal >= ₹3000            → ₹400 (forced)
// 2) Subtotal <  ₹3000 + heavy    → ₹400
// 3) Subtotal <  ₹3000 + no heavy → ₹200
const calculateDeliveryCharge = (items = []) => {
  const subtotal = calculateSubtotal(items);
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return HEAVY_PRODUCT_DELIVERY_CHARGE;
  return hasHeavyProduct(items) ? HEAVY_PRODUCT_DELIVERY_CHARGE : DEFAULT_DELIVERY_CHARGE;
};

module.exports = {
  DEFAULT_DELIVERY_CHARGE,
  HEAVY_PRODUCT_DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
  calculateDeliveryCharge,
  calculateSubtotal,
  hasHeavyProduct,
};