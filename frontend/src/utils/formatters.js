// Formatting utilities

export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  const num = Number(amount);
  return '₹' + num.toLocaleString('en-IN');
};

export const formatDate = (date = new Date()) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

