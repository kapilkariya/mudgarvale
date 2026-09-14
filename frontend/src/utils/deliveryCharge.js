const HEAVY_PRODUCT_CATEGORIES = ['gada', 'samtola'];
export const DEFAULT_DELIVERY_CHARGE = 200;
export const HEAVY_PRODUCT_DELIVERY_CHARGE = 400;
export const FREE_DELIVERY_THRESHOLD = 3000;

const normalizeCategory = (category = '') => String(category).trim().toLowerCase();

export const hasHeavyProduct = (items = []) =>
  items.some((item) => HEAVY_PRODUCT_CATEGORIES.includes(normalizeCategory(item.category)));

export const calculateSubtotal = (items = []) =>
  items.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

// Delivery rules:
//   subtotal >= ₹3000           → ₹400 (forced)
//   subtotal <  ₹3000 + heavy   → ₹400
//   subtotal <  ₹3000 + no heavy → ₹200
export const calculateDeliveryCharge = (items = []) => {
  const subtotal = calculateSubtotal(items);
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return HEAVY_PRODUCT_DELIVERY_CHARGE;
  return hasHeavyProduct(items) ? HEAVY_PRODUCT_DELIVERY_CHARGE : DEFAULT_DELIVERY_CHARGE;
};