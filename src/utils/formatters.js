export const ensureNumber = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleanValue = value.replace(/[^0-9.-]+/g, "");
    return parseFloat(cleanValue) || 0;
  }
  return 0;
};

export const formatCurrency = (value) => {
  const number = ensureNumber(value);
  return `$${number.toFixed(2)}`;
};
