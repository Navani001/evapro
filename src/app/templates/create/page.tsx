import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/component";
import { TemplateCreator } from "@/component/template/TemplateCreator";

export default async function TemplateCreationPage() {
  const data: any = await auth();
  
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }
  console.log("user data",data);

  return (
    <DashboardLayout user={data.user}>
      <TemplateCreator  token={data.user.token}/>
    </DashboardLayout>
  );
}
