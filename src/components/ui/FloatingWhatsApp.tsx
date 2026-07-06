import { createWhatsAppLink } from "@/src/lib/whatsapp";
import { Icon } from "@/src/components/ui/Icon";

export function FloatingWhatsApp() {
  return (
    <a
      href={createWhatsAppLink({
        message: "Halo UNA Project, saya ingin konsultasi produk UNA Project.",
      })}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat UNA Project via WhatsApp"
      className="motion-button fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-una-whatsapp text-white shadow-[0_12px_30px_-10px_rgb(31_174_92_/_70%)] hover:scale-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-una-gold sm:bottom-6 sm:right-6"
    >
      <Icon name="whatsapp" className="size-7" />
    </a>
  );
}
