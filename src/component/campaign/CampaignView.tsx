"use client";
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Chip, 
  Button, 
  Avatar,
  Progress,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/react";
import { 
  MdCampaign, 
  MdEdit, 
  MdPlayArrow, 
  MdPause, 
  MdStop,
  MdPeople,
  MdMessage,
  MdCheckCircle,
  MdSchedule,
  MdTrendingUp
} from "react-icons/md";
import { getRequest } from "@/utils";
import { Campaign } from "./types";

interface CampaignViewProps {
  campaignId: number;
  token: string;
  brandId?: number;
}

interface DeliveryStats {
  total: number;
  delivered: number;
  failed: number;
  pending: number;
}

interface MessageLog {
  id: number;
  user_id: number;
  user_name: string;
  status: "delivered" | "failed" | "pending";
  sent_at: string;
  delivered_at?: string;
  error_message?: string;
}

export const CampaignView: React.FC<CampaignViewProps> = ({ 
  campaignId, 
  token, 
  brandId = 1 
}) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [deliveryStats, setDeliveryStats] = useState<DeliveryStats>({
    total: 0,
    delivered: 0,
    failed: 0,
    pending: 0
  });
  const [messageLogs, setMessageLogs] = useState<MessageLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      setIsLoading(true);
      try {
        const campaignResponse = await getRequest(`campaign/campaigns/${campaignId}`, {
          Authorization: `Bearer ${token}`
        });
        console.log("Fetched campaign:", campaignResponse.data);
        
        const data = campaignResponse.data as any;
        if (data?.success && data?.data) {
          const campaignData = data.data;
          setCampaign(campaignData);
          
          // Calculate delivery stats from campaign data
          const stats = {
            total: campaignData.total_recipients || campaignData.targets?.length || 0,
            delivered: campaignData.messages_sent || 0,
            failed: 0, // Will be calculated from message logs if available
            pending: (campaignData.total_recipients || campaignData.targets?.length || 0) - (campaignData.messages_sent || 0)
          };
          setDeliveryStats(stats);
          
          // Mock message logs for now - replace with actual API call when available
          const mockLogs: MessageLog[] = campaignData.targets?.map((target: any, index: number) => ({
            id: index + 1,
            user_id: target.user_id || target.id || index + 1,
            user_name: target.user?.name || `User ${target.user_id || target.id || index + 1}`,
            status: index < (campaignData.messages_sent || 0) ? "delivered" : "pending" as "delivered" | "failed" | "pending",
            sent_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            delivered_at: index < (campaignData.messages_sent || 0) ? new Date(Date.now() - Math.random() * 3600000).toISOString() : undefined
          })) || [];
          
          setMessageLogs(mockLogs);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch campaign details:", error);
        setIsLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [campaignId, token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "success";
      case "completed": return "default";
      case "draft": return "warning";
      case "cancelled": return "danger";
      default: return "default";
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "success";
      case "failed": return "danger";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const deliveryRate = deliveryStats.total > 0 
    ? Math.round((deliveryStats.delivered / deliveryStats.total) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Campaign not found</h3>
        <p className="text-gray-500">The requested campaign could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl text-white shadow-lg">
              <MdCampaign className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Chip 
                  color={getStatusColor(campaign.status)} 
                  variant="flat"
                  size="sm"
                >
                  {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
                </Chip>
                <span className="text-sm text-gray-500">
                  Created {new Date(campaign.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="bordered"
              startContent={<MdEdit />}
            >
              Edit Campaign
            </Button>
            {campaign.status === "running" && (
              <Button
                color="warning"
                startContent={<MdPause />}
              >
                Pause
              </Button>
            )}
            {campaign.status === "draft" && (
              <Button
                color="success"
                startContent={<MdPlayArrow />}
              >
                Start Campaign
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Targets</p>
                <p className="text-2xl font-bold text-gray-900">{deliveryStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MdPeople className="text-blue-600 text-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{deliveryStats.delivered}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MdCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{deliveryStats.failed}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <MdMessage className="text-red-600 text-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-purple-600">{deliveryRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <MdTrendingUp className="text-purple-600 text-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Details */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <h3 className="text-lg font-semibold">Campaign Details</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Campaign Type</p>
                  <p className="text-sm text-gray-900">{campaign.campaign_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Template</p>
                  <p className="text-sm text-gray-900">{campaign.template?.name || `Template ${campaign.template_id}`}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="text-sm text-gray-900">{new Date(campaign.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-sm text-gray-900">{new Date(campaign.updated_at).toLocaleString()}</p>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Template Content</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900">{campaign.template?.content.text}</p>
                  {campaign.template?.content.suggestions && campaign.template.content.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {campaign.template.content.suggestions.map((suggestion: any, index: number) => (
                        <Chip key={index} size="sm" variant="flat" color="primary">
                          {suggestion.text}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Delivery Progress */}
        <div>
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <h3 className="text-lg font-semibold">Delivery Progress</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {deliveryRate}%
                </div>
                <Progress 
                  value={deliveryRate} 
                  color="primary" 
                  className="mb-4"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Delivered</span>
                  <span className="text-sm font-medium text-green-600">{deliveryStats.delivered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Failed</span>
                  <span className="text-sm font-medium text-red-600">{deliveryStats.failed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">{deliveryStats.pending}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Message Logs */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <h3 className="text-lg font-semibold">Message Delivery Logs</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Message delivery logs">
            <TableHeader>
              <TableColumn>RECIPIENT</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>SENT AT</TableColumn>
              <TableColumn>DELIVERED AT</TableColumn>
              <TableColumn>ERROR</TableColumn>
            </TableHeader>
            <TableBody>
              {messageLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="sm"
                        name={log.user_name}
                        className="bg-primary-100 text-primary-600"
                      />
                      <span className="text-sm font-medium">{log.user_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={getMessageStatusColor(log.status)} 
                      variant="flat" 
                      size="sm"
                    >
                      {log.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {new Date(log.sent_at).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {log.delivered_at ? new Date(log.delivered_at).toLocaleString() : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-red-600">
                      {log.error_message || '-'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};
