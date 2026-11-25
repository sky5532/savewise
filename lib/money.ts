export const nairaToKobo = (naira: number) => Math.round(naira * 100);

export const formatNaira = (kobo: number) =>
  "₦" +
  (kobo / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });