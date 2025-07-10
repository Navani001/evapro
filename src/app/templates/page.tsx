import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { ButtonComponent, DashboardLayout } from "@/component";
import { TemplatesTable } from "@/component/template/TemplatesTable";
import Link from "next/link";
import { Button } from "@heroui/react";
import { MdAdd } from "react-icons/md";

export default async function TemplatesPage() {
  const data: any = await auth();
  
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={data.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Message Templates</h1>
            <p className="text-gray-600 mt-1">Create and manage your RCS message templates</p>
          </div>
          <Link href="/templates/create">
            <ButtonComponent
        isIcon={false}
             
              buttonText="Add Template"
            />
             
          </Link>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-xl shadow-sm  overflow-hidden">
          <TemplatesTable token={data.user.token} brandId={1} />
        </div>
      </div>
    </DashboardLayout>
  );
}
