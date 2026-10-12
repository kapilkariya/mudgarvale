const HEAVY_PRODUCT_CATEGORIES = ['gada', 'samtola'];
const DEFAULT_DELIVERY_CHARGE = 200;
const HEAVY_PRODUCT_DELIVERY_CHARGE = 400;
const FREE_DELIVERY_THRESHOLD = 3000;
const STICKS_DELIVERY_CHARGE = 200;

const normalizeCategory = (category = '') => String(category).trim().toLowerCase();

const hasHeavyProduct = (items = []) =>
  items.some((item) => HEAVY_PRODUCT_CATEGORIES.includes(normalizeCategory(item.category)));

const hasSticks = (items = []) =>
  items.some((item) => normalizeCategory(item.category) === 'sticks');

const calculateSubtotal = (items = []) =>
  items.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

// del1: base delivery, ignoring sticks entirely
const calculateBaseDelivery = (nonSticksItems = []) => {
  // Nothing to charge base delivery on (e.g. cart has only sticks)
  if (nonSticksItems.length === 0) return 0;

  const subtotal = calculateSubtotal(nonSticksItems);
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return HEAVY_PRODUCT_DELIVERY_CHARGE;
  return hasHeavyProduct(nonSticksItems)
    ? HEAVY_PRODUCT_DELIVERY_CHARGE
    : DEFAULT_DELIVERY_CHARGE;
};

// del2: flat ₹200 if the order contains any sticks item, else 0
const calculateSticksDelivery = (items = []) =>
  hasSticks(items) ? STICKS_DELIVERY_CHARGE : 0;

// Total delivery = min(400, del1 + del2)
const calculateDeliveryCharge = (items = []) => {
  const nonSticksItems = items.filter(
    (item) => normalizeCategory(item.category) !== 'sticks'
  );

  const del1 = calculateBaseDelivery(nonSticksItems);
  const del2 = calculateSticksDelivery(items);

  return Math.min(400, del1 + del2);
};

module.exports = {
  DEFAULT_DELIVERY_CHARGE,
  HEAVY_PRODUCT_DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
  STICKS_DELIVERY_CHARGE,
  calculateDeliveryCharge,
  calculateSubtotal,
  hasHeavyProduct,
  hasSticks,
};