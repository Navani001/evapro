import { getRequest } from "./index";

// Dashboard API service functions
export interface DashboardStats {
  campaigns: {
    active: number;
    scheduled: number;
    completed: number;
    draft: number;
    failed: number;
    totalRuntime: number;
  };
  metrics: {
    messagesSent: number;
    totalReach: number;
    engagementRate: number;
    conversionRate: number;
    averageResponseTime: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'campaign' | 'message' | 'analytics' | 'template';
    message: string;
    timestamp: Date;
    duration?: number;
  }>;
  performance: {
    systemUptime: number;
    processingQueueSize: number;
    averageLatency: number;
  };
}

export interface ComprehensiveDashboardData {
  brand: {
    id: number;
    name: string;
    display_name: string;
    status: string;
    verified: boolean;
  };
  campaigns: {
    active: number;
    scheduled: number;
    completed: number;
    draft: number;
    failed: number;
    total: number;
    totalRuntime: number;
    recent: Array<{
      id: number;
      name: string;
      status: string;
      type: string;
      created: string;
      recipients: number;
      sent: number;
      template?: any;
      agent?: any;
    }>;
  };
  metrics: {
    messagesSent: number;
    totalReach: number;
    engagementRate: number;
    conversionRate: number;
    averageResponseTime: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    messageBreakdown: {
      delivered: number;
      failed: number;
      read: number;
      pending: number;
    };
  };
  templates: {
    total: number;
    active: number;
    draft: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    recent: any[];
  };
  team: {
    agents: number;
    activeAgents: number;
    verifiedAgents: number;
    agentList: Array<{
      id: number;
      name: string;
      status: string;
      verified: boolean;
    }>;
  };
  recentActivity: Array<{
    id: string;
    type: 'campaign' | 'message' | 'analytics' | 'template';
    message: string;
    timestamp: string;
    duration?: number;
    campaignType?: string;
    agentName?: string;
    category?: string;
  }>;
  performance: {
    systemUptime: number;
    processingQueueSize: number;
    averageLatency: number;
    healthStatus: string;
  };
  config: any;
  timestamp: string;
  source: string;
}

/**
 * Get comprehensive dashboard overview data
 */
export const getDashboardOverview = async (
  brandId: number,
  token: string
): Promise<{ success: boolean; data?: ComprehensiveDashboardData; error?: string }> => {
  try {
    const response = await getRequest(`dashboard/overview/${brandId}`, {
      Authorization: `Bearer ${token}`
    });

    const data = response?.data as any;
    if (data?.success && data?.data) {
      return {
        success: true,
        data: data.data
      };
    }

    return {
      success: false,
      error: 'Invalid response format'
    };
  } catch (error) {
    console.error('Dashboard overview API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get basic dashboard statistics
 */
export const getDashboardStats = async (
  brandId: number,
  token: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await getRequest(`dashboard/stats/${brandId}`, {
      Authorization: `Bearer ${token}`
    });

    const data = response?.data as any;
    if (data?.success && data?.data) {
      return {
        success: true,
        data: data.data
      };
    }

    return {
      success: false,
      error: 'Invalid response format'
    };
  } catch (error) {
    console.error('Dashboard stats API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get dashboard configuration
 */
export const getDashboardConfig = async (
  token: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await getRequest('dashboard/config', {
      Authorization: `Bearer ${token}`
    });

    const data = response?.data as any;
    if (data?.success && data?.data) {
      return {
        success: true,
        data: data.data
      };
    }

    return {
      success: false,
      error: 'Invalid response format'
    };
  } catch (error) {
    console.error('Dashboard config API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Transform comprehensive dashboard data to DashboardStats format
 */
export const transformToDashboardStats = (data: ComprehensiveDashboardData): DashboardStats => {
  return {
    campaigns: {
      active: data.campaigns?.active || 0,
      scheduled: data.campaigns?.scheduled || 0,
      completed: data.campaigns?.completed || 0,
      draft: data.campaigns?.draft || 0,
      failed: data.campaigns?.failed || 0,
      totalRuntime: data.campaigns?.totalRuntime || 0
    },
    metrics: {
      messagesSent: data.metrics?.messagesSent || 0,
      totalReach: data.metrics?.totalReach || 0,
      engagementRate: data.metrics?.engagementRate || 0,
      conversionRate: data.metrics?.conversionRate || 0,
      averageResponseTime: data.metrics?.averageResponseTime || 0,
      deliveryRate: data.metrics?.deliveryRate || 0,
      openRate: data.metrics?.openRate || 0,
      clickRate: data.metrics?.clickRate || 0
    },
    recentActivity: data.recentActivity?.map((activity: any) => ({
      id: activity.id,
      type: activity.type,
      message: activity.message,
      timestamp: new Date(activity.timestamp),
      duration: activity.duration
    })) || [],
    performance: {
      systemUptime: data.performance?.systemUptime || 0,
      processingQueueSize: data.performance?.processingQueueSize || 0,
      averageLatency: data.performance?.averageLatency || 0
    }
  };
};

/**
 * Get formatted time-based statistics
 */
export const getTimeBasedStats = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const timeMultiplier = currentHour < 6 ? 0.3 : currentHour < 12 ? 0.8 : currentHour < 18 ? 1.0 : 0.6;
  
  return {
    timeMultiplier,
    currentHour,
    timeOfDay: currentHour < 6 ? 'early_morning' : 
               currentHour < 12 ? 'morning' : 
               currentHour < 18 ? 'afternoon' : 'evening',
    isBusinessHours: currentHour >= 9 && currentHour <= 17
  };
};

/**
 * Format duration in minutes to human readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`.trim();
};

/**
 * Format time ago from timestamp
 */
export const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

/**
 * Get performance status color based on metrics
 */
export const getPerformanceStatus = (latency: number, queueSize: number) => {
  if (latency < 200 && queueSize < 10) return { status: 'excellent', color: 'success' };
  if (latency < 500 && queueSize < 25) return { status: 'good', color: 'primary' };
  if (latency < 1000 && queueSize < 50) return { status: 'fair', color: 'warning' };
  return { status: 'poor', color: 'danger' };
};

export default {
  getDashboardOverview,
  getDashboardStats,
  getDashboardConfig,
  transformToDashboardStats,
  getTimeBasedStats,
  formatDuration,
  formatTimeAgo,
  getPerformanceStatus
};
