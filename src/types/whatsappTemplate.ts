export type ApiWhatsAppTemplate = {
  id: string;
  template_name: string;
  category: string;
  message_pattern: string;
  is_default: boolean;
  is_active: boolean;
  created_at?: string;
};
