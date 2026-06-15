const WHATSAPP_PHONE_NUMBER = "6281234567890";

export function createWhatsAppLink(productName?: string) {
  const message = productName
    ? `Halo UNA Project, saya ingin konsultasi produk ${productName}.`
    : "Halo UNA Project, saya ingin konsultasi produk UNA Project.";

  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;
}
