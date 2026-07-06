import { redirect } from "next/navigation";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { verifyAdminSession } from "@/src/lib/adminSession";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await verifyAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
