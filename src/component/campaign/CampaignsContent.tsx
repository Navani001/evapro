"use client";
import React, { useEffect, useState } from "react";
import { CampaignsTable } from "@/component/campaign/CampaignsTable";
import { CampaignStats } from "@/component/campaign/CampaignStats";
import Link from "next/link";
import { Button } from "@heroui/react";
import { MdAdd, MdCampaign } from "react-icons/md";
import { getRequest } from "@/utils";

interface CampaignStatsData {
  total: number;
  active: number;
  draft: number;
  completed: number;
}

interface CampaignsContentProps {
  token: string;
  brandId?: number;
}

export const CampaignsContent: React.FC<CampaignsContentProps> = ({ 
  token, 
  brandId = 1 
}) => {
  const [stats, setStats] = useState<CampaignStatsData>({
    total: 0,
    active: 0,
    draft: 0,
    completed: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Fetch campaign stats
        const response = await getRequest(`campaign/brands/${brandId}/campaigns`, {
          Authorization: `Bearer ${token}`
        });
        
        const data = response.data as any;
        if (data?.success && data?.data?.campaigns) {
          const campaigns = data.data.campaigns;
          const campaignStats = {
            total: campaigns.length,
            active: campaigns.filter((c: any) => c.status === 'running').length,
            draft: campaigns.filter((c: any) => c.status === 'draft').length,
            completed: campaigns.filter((c: any) => c.status === 'completed').length
          };
          setStats(campaignStats);
        }
      } catch (error) {
        console.error("Failed to load campaigns data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadStats();
    }
  }, [token, brandId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl text-white shadow-lg">
            <MdCampaign className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your RCS campaigns</p>
          </div>
        </div>
        <Link href="/campaigns/create">
          <Button 
            color="primary" 
            startContent={<MdAdd />}
            className="bg-gradient-to-r from-purple-600 to-violet-700 hover:shadow-lg transition-all"
          >
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <CampaignStats stats={stats} />

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <CampaignsTable token={token} brandId={brandId} />
      </div>
    </div>
  );
};
