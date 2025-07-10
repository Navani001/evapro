import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/component";
import { CampaignsContent } from "@/component/campaign/CampaignsContent";

export default async function CampaignsPage() {
  const data: any = await auth();
  
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={data.user}>
      <CampaignsContent token={data.user.token} brandId={1} />
    </DashboardLayout>
  );
}
