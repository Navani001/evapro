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
  const params = useParams();
  const brandId = params.brandId as string;
  const agentId = params.agentId as string;
  
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrandAndAgentInfo = async () => {
      setIsLoading(true);
      try {
        // Fetch brand info
        const brandResponse = await fetch(`/api/brand/${brandId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (brandResponse.ok) {
          const brandData = await brandResponse.json();
          setBrandInfo(brandData.data);
        }

        // Fetch agent info
        const agentResponse = await fetch(`/api/brandAgent/${agentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (agentResponse.ok) {
          const agentData = await agentResponse.json();
          setAgentInfo(agentData.data);
        }
      } catch (error) {
        console.error('Error fetching brand/agent info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (brandId && agentId) {
      fetchBrandAndAgentInfo();
    }
  }, [brandId, agentId]);

  if (isLoading) {
    return (
      <DashboardLayout user={undefined}>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-gray-600 font-medium">Loading audience data...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/audience"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Audience</span>
              </Link>
            </div>
          </div>
          
          <div className="mt-4">
            <Breadcrumbs className="mb-4">
              <BreadcrumbItem>
                <Link href="/audience" className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Audience
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {brandInfo?.display_name || brandInfo?.name || `Brand ${brandId}`}
                </div>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {agentInfo?.display_name || agentInfo?.name || `Agent ${agentId}`}
                </div>
              </BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Audience Management
                </h1>
                <p className="text-gray-600">
                  Manage customers for {brandInfo?.display_name || brandInfo?.name} - {agentInfo?.display_name || agentInfo?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand & Agent Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Brand Information</h3>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <p className="font-medium">{brandInfo?.name || 'Loading...'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Display Name:</span>
                  <p className="font-medium">{brandInfo?.display_name || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Brand ID:</span>
                  <p className="font-medium">{brandId}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Agent Information</h3>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <p className="font-medium">{agentInfo?.name || 'Loading...'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Display Name:</span>
                  <p className="font-medium">{agentInfo?.display_name || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Agent ID:</span>
                  <p className="font-medium">{agentId}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Customer Management */}
        <CustomersContent brandId={brandId} agentId={agentId} />
      </div>
    </DashboardLayout>
  );
};

export default AudiencePage;
