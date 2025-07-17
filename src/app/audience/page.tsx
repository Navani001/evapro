"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardBody, CardHeader, Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { Users, ArrowLeft, Building, User } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/component';
import { CustomersContent } from '@/component/customer';

interface BrandInfo {
  id: number;
  name: string;
  display_name: string | null;
}

interface AgentInfo {
  id: number;
  name: string;
  display_name: string | null;
}

const AudiencePage: React.FC = () => {
  const brandId = "1" as string;
  const agentId = "2" as string;

 
  return (
    <DashboardLayout user={undefined}>
      <div className="space-y-6">
       

        

        {/* Customer Management Section */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Customer Management</h2>
                  <p className="text-gray-600">
                    Add, manage, and communicate with your customers for this brand and agent
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Quick Actions</div>
                <div className="flex gap-2 mt-2">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Add Customer
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Import Contacts
                  </div>
                  <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    Send Messages
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <CustomersContent brandId={brandId} agentId={agentId} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AudiencePage;
