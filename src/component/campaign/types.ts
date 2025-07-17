export interface Campaign {
  id: number;
  name: string;
  campaign_type: string;
  template_id: number;
  targets: number[];
  status: string;
  created_at: string;
  updated_at: string;
  template?: {
    id: number;
    name: string;
    template_type: string;
    content: {
      text: string;
      suggestions: any[];
    };
  };
  _count?: {
    messages: number;
    deliveries: number;
  };
}

export interface CampaignCreateData {
  template_id: number;
  name: string;
  campaign_type: string;
  targets: number[];
  start_time: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
}

export const campaignTypes = [
  { key: "broadcast", label: "Broadcast Campaign" },
  { key: "targeted", label: "Targeted Campaign" },
  { key: "promotional", label: "Promotional Campaign" },
  { key: "transactional", label: "Transactional Campaign" },
  { key: "reminder", label: "Reminder Campaign" },
];

export const campaignStatuses = [
  { key: "draft", label: "Draft", color: "warning" },
  { key: "scheduled", label: "Scheduled", color: "primary" },
  { key: "running", label: "Running", color: "success" },
  { key: "completed", label: "Completed", color: "default" },
  { key: "cancelled", label: "Cancelled", color: "danger" },
];
