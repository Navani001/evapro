import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/component";
import { CampaignCreator } from "@/component/campaign/CampaignCreator";

export default async function CampaignCreationPage() {
  const data: any = await auth();
  
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={data.user}>
      <CampaignCreator token={data.user.token} brandId={1} />
    </DashboardLayout>
  );
}
