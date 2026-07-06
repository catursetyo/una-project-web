import type { Metadata } from "next";
import { getAdminCollection } from "@/src/lib/adminApi";
import { AdminTutorialsClient } from "@/src/components/admin/tutorials/AdminTutorialsClient";
import type { ApiTutorial } from "@/src/types/tutorial";

export const metadata: Metadata = {
  title: "Manajemen Tutorial | UNA Project Admin",
};

export default async function AdminTutorialsPage() {
  const tutorials = await getAdminCollection<ApiTutorial>("tutorials");
  return <AdminTutorialsClient initialTutorials={tutorials} />;
}
