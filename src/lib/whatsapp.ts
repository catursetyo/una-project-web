const WHATSAPP_PHONE_NUMBER = "6281234567890";

type WhatsAppLinkInput =
  | string
  | {
      message?: string;
      productName?: string;
    };

export function createWhatsAppLink(input?: WhatsAppLinkInput) {
  const message =
    typeof input === "object"
      ? (input.message ??
        (input.productName
          ? `Halo UNA Project, saya ingin konsultasi produk ${input.productName}.`
          : "Halo UNA Project, saya ingin konsultasi produk UNA Project."))
      : input
        ? `Halo UNA Project, saya ingin konsultasi produk ${input}.`
        : "Halo UNA Project, saya ingin konsultasi produk UNA Project.";

  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;
}
