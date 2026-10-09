const HEAVY_PRODUCT_CATEGORIES = ['gada', 'samtola'];
export const DEFAULT_DELIVERY_CHARGE = 200;
export const HEAVY_PRODUCT_DELIVERY_CHARGE = 400;
export const FREE_DELIVERY_THRESHOLD = 3000;
export const STICKS_DELIVERY_CHARGE = 200;

const normalizeCategory = (category = '') => String(category).trim().toLowerCase();

export const hasHeavyProduct = (items = []) =>
  items.some((item) => HEAVY_PRODUCT_CATEGORIES.includes(normalizeCategory(item.category)));

export const hasSticks = (items = []) =>
  items.some((item) => normalizeCategory(item.category) === 'sticks');

export const calculateSubtotal = (items = []) =>
  items.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

// del1: same rules as before, but ignores sticks entirely
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

// Total delivery = del1 + del2
export const calculateDeliveryCharge = (items = []) => {
  const nonSticksItems = items.filter(
    (item) => normalizeCategory(item.category) !== 'sticks'
  );

  const del1 = calculateBaseDelivery(nonSticksItems);
  const del2 = calculateSticksDelivery(items);

  return Math.min(400, del1 + del2);
};