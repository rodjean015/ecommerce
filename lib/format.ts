const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}
