const HEAVY_PRODUCT_CATEGORIES = ['gada', 'samtola'];
export const DEFAULT_DELIVERY_CHARGE = 200;
export const HEAVY_PRODUCT_DELIVERY_CHARGE = 400;

const normalizeCategory = (category = '') => String(category).trim().toLowerCase();

export const hasHeavyProduct = (items = []) =>
  items.some((item) => HEAVY_PRODUCT_CATEGORIES.includes(normalizeCategory(item.category)));

export const calculateDeliveryCharge = (items = []) =>
  hasHeavyProduct(items) ? HEAVY_PRODUCT_DELIVERY_CHARGE : DEFAULT_DELIVERY_CHARGE;
