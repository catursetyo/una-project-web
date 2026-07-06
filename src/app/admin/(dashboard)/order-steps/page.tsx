import type { Metadata } from "next";
import { getAdminCollection } from "@/src/lib/adminApi";
import { AdminOrderStepsClient } from "@/src/components/admin/order-steps/AdminOrderStepsClient";
import type { ApiOrderStep } from "@/src/types/orderStep";

export const metadata: Metadata = {
  title: "Manajemen Alur Pemesanan | UNA Project Admin",
};

export default async function AdminOrderStepsPage() {
  const steps = await getAdminCollection<ApiOrderStep>("order-steps");
  return <AdminOrderStepsClient initialSteps={steps} />;
}
