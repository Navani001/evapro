"use client";
import React, { useEffect, useState, useMemo } from "react";
import { CampaignsTable } from "@/component/campaign/CampaignsTable";
import { CampaignStats } from "@/component/campaign/CampaignStats";
import Link from "next/link";
import { Button, Chip } from "@heroui/react";
import { MdAdd, MdCampaign, MdSchedule, MdTrendingUp } from "react-icons/md";
import { getRequest } from "@/utils";

// Default configuration values
const DEFAULT_CAMPAIGN_CONFIG = {
  duration: 60, // Default campaign duration in minutes
  responseTimeout: 30, // Default response timeout in seconds
  retryInterval: 15, // Default retry interval in minutes
  maxRetries: 3, // Default maximum retries
  cooldownPeriod: 120, // Default cooldown period in minutes
  targetBatchSize: 100, // Default target batch size
  processingDelay: 5, // Default processing delay in minutes
};

interface CampaignStatsData {
  total: number;
  active: number;
  draft: number;
  completed: number;
  scheduled: number;
  paused: number;
  failed: number;
  totalDuration: number; // in minutes
  avgResponseTime: number; // in seconds
  totalMessages: number;
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
    completed: 0,
    scheduled: 0,
    paused: 0,
    failed: 0,
    totalDuration: 0,
    avgResponseTime: 0,
    totalMessages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Memoized default stats with time-based calculations
  const defaultStats = useMemo((): CampaignStatsData => {
    const now = new Date();
    const todayMinutes = now.getHours() * 60 + now.getMinutes();
    
    return {
      total: 5, // Default to showing 5 sample campaigns
      active: 2,
      draft: 1,
      completed: 1,
      scheduled: 1,
      paused: 0,
      failed: 0,
      totalDuration: DEFAULT_CAMPAIGN_CONFIG.duration * 5, // 5 hours total
      avgResponseTime: DEFAULT_CAMPAIGN_CONFIG.responseTimeout,
      totalMessages: DEFAULT_CAMPAIGN_CONFIG.targetBatchSize * 5
    };
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !token) return;
    
    const interval = setInterval(() => {
      loadStats();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [autoRefresh, token, brandId]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      // Fetch campaign stats
      const response = await getRequest(`campaign/brands/${brandId}/campaigns`, {
        Authorization: `Bearer ${token}`
      });
      
      const data = response.data as any;
        if (data?.success && data?.data?.campaigns) {
          const campaigns = data.data.campaigns;
          
          // Calculate comprehensive campaign statistics
          const totalDuration = campaigns.reduce((sum: number, c: any) => {
            return sum + (c.duration_minutes || c.estimated_duration || 60); // Default 60 minutes
          }, 0);
          
          const totalMessages = campaigns.reduce((sum: number, c: any) => {
            return sum + (c.message_count || c.target_count || 0);
          }, 0);
          
          const responseTimes = campaigns
            .map((c: any) => c.avg_response_time || c.response_time || 0)
            .filter((rt: number) => rt > 0);
          
          const avgResponseTime = responseTimes.length > 0 
            ? responseTimes.reduce((sum: number, rt: number) => sum + rt, 0) / responseTimes.length
            : 30; // Default 30 seconds
          
          const campaignStats: CampaignStatsData = {
            total: campaigns.length || 0,
            active: campaigns.filter((c: any) => c.status === 'running' || c.status === 'active').length || 0,
            draft: campaigns.filter((c: any) => c.status === 'draft').length || 0,
            completed: campaigns.filter((c: any) => c.status === 'completed' || c.status === 'finished').length || 0,
            scheduled: campaigns.filter((c: any) => c.status === 'scheduled' || c.start_time > new Date().toISOString()).length || 0,
            paused: campaigns.filter((c: any) => c.status === 'paused' || c.status === 'suspended').length || 0,
            failed: campaigns.filter((c: any) => c.status === 'failed' || c.status === 'error').length || 0,
            totalDuration: totalDuration || 300, // Default 5 hours total
            avgResponseTime: Math.round(avgResponseTime),
            totalMessages: totalMessages || 0
          };
          
          setStats(campaignStats);
        } else {
          // Use default stats if no data is available
          setStats(defaultStats);
        }
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to load campaigns data:", error);
        // Fallback to default stats on error
        setStats(defaultStats);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    useEffect(() => {
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
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-600">Manage and monitor your RCS campaigns</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-500">
                  {autoRefresh ? 'Live' : 'Manual'} • Updated {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="flat"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
          >
            {autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
          </Button>
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
      </div>

      {/* Default Configuration Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <MdSchedule className="text-blue-500" />
          Default Campaign Configuration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <Chip color="primary" variant="flat" size="sm">
              {DEFAULT_CAMPAIGN_CONFIG.duration} min
            </Chip>
            <div className="text-xs text-gray-500 mt-1">Duration</div>
          </div>
          <div className="text-center">
            <Chip color="success" variant="flat" size="sm">
              {DEFAULT_CAMPAIGN_CONFIG.responseTimeout}s
            </Chip>
            <div className="text-xs text-gray-500 mt-1">Response Timeout</div>
          </div>
          <div className="text-center">
            <Chip color="warning" variant="flat" size="sm">
              {DEFAULT_CAMPAIGN_CONFIG.retryInterval} min
            </Chip>
            <div className="text-xs text-gray-500 mt-1">Retry Interval</div>
          </div>
          <div className="text-center">
            <Chip color="secondary" variant="flat" size="sm">
              {DEFAULT_CAMPAIGN_CONFIG.targetBatchSize}
            </Chip>
            <div className="text-xs text-gray-500 mt-1">Batch Size</div>
          </div>
        </div>
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
