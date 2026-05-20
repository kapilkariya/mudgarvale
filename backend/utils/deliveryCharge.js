const HEAVY_PRODUCT_CATEGORIES = ['gada', 'samtola'];
const DEFAULT_DELIVERY_CHARGE = 200;
const HEAVY_PRODUCT_DELIVERY_CHARGE = 400;

const normalizeCategory = (category = '') => String(category).trim().toLowerCase();

const hasHeavyProduct = (items = []) =>
  items.some((item) => HEAVY_PRODUCT_CATEGORIES.includes(normalizeCategory(item.category)));

const calculateDeliveryCharge = (items = []) =>
  hasHeavyProduct(items) ? HEAVY_PRODUCT_DELIVERY_CHARGE : DEFAULT_DELIVERY_CHARGE;

const calculateSubtotal = (items = []) =>
  items.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

module.exports = {
  DEFAULT_DELIVERY_CHARGE,
  HEAVY_PRODUCT_DELIVERY_CHARGE,
  calculateDeliveryCharge,
  calculateSubtotal,
  hasHeavyProduct,
};
