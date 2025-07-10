import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/component";
import { CampaignView } from "@/component/campaign/CampaignView";

interface CampaignDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function CampaignDetailsPage({ params }: CampaignDetailsPageProps) {
  const data: any = await auth();
  
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={data.user}>
      <CampaignView 
        campaignId={parseInt(params.id)} 
        token={data.user.token} 
        brandId={1} 
      />
    </DashboardLayout>
  );
}
