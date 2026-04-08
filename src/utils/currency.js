// Format price in Nepali Rupees
export const formatPrice = (amount) => {
  const num = (parseFloat(amount) || 0) * 100;
  return 'Rs. ' + num.toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
