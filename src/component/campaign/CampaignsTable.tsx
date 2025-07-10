"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "../ui/DataTable";
import { Button, Chip } from "@heroui/react";
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdPlayArrow, MdPause, MdStop } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRequest, postRequest } from "@/utils";
import { Campaign, campaignStatuses } from "./types";

interface CampaignsTableProps {
  token?: string;
  brandId?: number;
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({ token, brandId = 1 }) => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  // Function to update campaign status
  const updateCampaignStatus = async (campaignId: number, newStatus: string) => {
    setIsUpdating(campaignId);
    try {
      // Use PATCH method for status update as per backend API
      const response = await fetch(`/api/campaign/campaigns/${campaignId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data?.success) {
        // Update local state
        setCampaigns(prev => prev.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        ));
        console.log(`Campaign ${campaignId} status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Failed to update campaign status:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await getRequest(`campaign/brands/${brandId}/campaigns`, {
          Authorization: `Bearer ${token}`
        });
        console.log("Fetched campaigns:", response.data);
        const data = response.data as any;
        if (data) {
          setCampaigns(data.campaigns);
          setPagination(prev => ({ 
            ...prev, 
            total: data.total,
            page: data.page 
          }));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        setIsLoading(false);
      }
    };

    if (token && brandId) {
      fetchCampaigns();
    }
  }, [token, brandId, pagination.page]);

  const columns = [
    { key: "name", label: "Campaign Name", sortable: true },
    { key: "campaign_type", label: "Type", sortable: true },
    { key: "template", label: "Template", sortable: false },
    { key: "targets", label: "Targets", sortable: false },
    { 
      key: "status", 
      label: "Status", 
      sortable: true,
      render: (campaign: Campaign) => (
        <Chip 
          size="sm" 
          variant="flat"
          color={
            campaign.status === "running" ? "success" :
            campaign.status === "draft" ? "warning" :
            campaign.status === "completed" ? "default" :
            campaign.status === "paused" ? "secondary" :
            "danger"
          }
        >
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </Chip>
      )
    },
    { key: "_count", label: "Performance", sortable: false },
    { key: "updated_at", label: "Last Updated", sortable: true },
    { key: "actions", label: "Actions", sortable: false }
  ];

  const getStatusActions = (campaign: Campaign) => {
    const baseActions = [
      {
        key: "view",
        label: "View",
        icon: <MdVisibility />,
        color: "default" as const,
        onAction: (campaign: Campaign) => {
          router.push(`/campaigns/${campaign.id}`);
        }
      },
      {
        key: "edit",
        label: "Edit",
        icon: <MdEdit />,
        color: "primary" as const,
        onAction: (campaign: Campaign) => {
          router.push(`/campaigns/${campaign.id}/edit`);
        }
      }
    ];

    // Add status-specific actions
    if (campaign.status === "draft") {
      baseActions.push({
        key: "start",
        label: "Start Campaign",
        icon: <MdPlayArrow />,
        color: "primary" as const,
        onAction: (campaign: Campaign) => {
          updateCampaignStatus(campaign.id, "running");
        }
      });
    } else if (campaign.status === "running") {
      baseActions.push({
        key: "pause",
        label: "Pause",
        icon: <MdPause />,
        color: "default" as const,
        onAction: (campaign: Campaign) => {
          updateCampaignStatus(campaign.id, "paused");
        }
      });
    }

    // Add delete action for drafts
    if (campaign.status === "draft" || campaign.status === "completed") {
      baseActions.push({
        key: "delete",
        label: "Delete",
        icon: <MdDelete />,
        color: "default" as const,
        onAction: (campaign: Campaign) => {
          console.log("Delete campaign:", campaign);
          // Show confirmation dialog
        }
      });
    }

    return baseActions;
  };

  const handleRowClick = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.id}`);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const emptyContent = (
    <div className="text-center py-12">
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MdAdd className="text-2xl text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
        <p className="text-gray-500 mb-6">Start engaging your audience with your first campaign</p>
        <Link href="/campaigns/create">
          <Button color="primary" startContent={<MdAdd />}>
            Create Your First Campaign
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={campaigns.map(campaign => ({
          ...campaign,
          actions: getStatusActions(campaign)
        }))}
        actions={[]}
        isLoading={isLoading}
        emptyContent={emptyContent}
        pagination={{
          total: pagination.total,
          page: pagination.page,
          pageSize: pagination.pageSize,
          onPageChange: handlePageChange
        }}
        onRowClick={handleRowClick}
      />
    </div>
  );
};
