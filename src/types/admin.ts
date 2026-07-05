export type AdminSectionSlug =
  | "products"
  | "testimonials"
  | "tutorials"
  | "order-steps"
  | "whatsapp-templates";

export type AdminTableRow = {
  id: string;
  cells: string[];
  status: "Aktif" | "Draft";
  featured?: boolean;
};

export type AdminSection = {
  slug: AdminSectionSlug;
  label: string;
  title: string;
  description: string;
  actionLabel: string;
  columns: string[];
  rows: AdminTableRow[];
  canDelete?: boolean;
};
