"use client";
import React, { useState, useEffect } from "react";
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Card, 
  CardBody, 
  CardHeader,
  Chip,
  Avatar,
  Checkbox,
  Divider,
  Progress,
  Badge,
  DatePicker
} from "@heroui/react";
import { 
  MdSend, 
  MdSettings, 
  MdCheckCircle, 
  MdInfo,
  MdPeople,
  MdDescription,
  MdCampaign
} from "react-icons/md";
import { getRequest, postRequest } from "@/utils";
import { CampaignCreateData, campaignTypes, User } from "./types";

interface Template {
  id: number;
  name: string;
  template_type: string;
  category: string;
  content: {
    text: string;
    suggestions: any[];
  };
  variables: Record<string, string>;
}

interface CampaignCreatorProps {
  token: string;
  brandId?: number;
}

export const CampaignCreator: React.FC<CampaignCreatorProps> = ({ 
  token, 
  brandId = 1 
}) => {
  const [campaign, setCampaign] = useState<CampaignCreateData>({
    template_id: 0,
    name: "",
    campaign_type: "",
    targets: [],
    start_time: ""
  });

  const [templates, setTemplates] = useState<Template[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 5;

    if (campaign.name.trim()) completed++;
    if (campaign.campaign_type) completed++;
    if (campaign.template_id > 0) completed++;
    if (campaign.targets.length > 0) completed++;
    if (campaign.start_time) completed++;

    return Math.round((completed / total) * 100);
  };

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const response = await getRequest(`template/brands/${brandId}/templates`, {
          Authorization: `Bearer ${token}`
        });
        const data = response.data as any;
        if (data?.templates) {
          // Only show valid templates
          const validTemplates = data.templates.filter((t: Template) => t.content?.text);
          setTemplates(validTemplates);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    if (token) {
      fetchTemplates();
    }
  }, [token, brandId]);

  // Fetch users for targeting
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await getRequest(`userSub/brand/${brandId}`, {
          Authorization: `Bearer ${token}`
        });
        console.log("Fetched user subscriptions:", response.data);
        
        const data = response.data as any;
        if (data?.subscriptions) {

          // Transform subscription data to user format
          const users = data.subscriptions
          .filter((sub: any) => sub.status === 'subscribed') // Only subscribed users
          .map((sub: any) => ({
            id: sub.user.id,
            name: sub.user.name || `User ${sub.user.id}`,
            email: sub.user.email || '',
            phone: `${sub.user.country_code}${sub.user.phone_number}`,
            status: sub.status
          }));
          
          console.log("subed users",users)
          setUsers(users);
        }
        setLoadingUsers(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoadingUsers(false);
      }
    };

    if (token && brandId) {
      fetchUsers();
    }
  }, [token, brandId]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const id = parseInt(templateId);
    const template = templates.find(t => t.id === id);
    setSelectedTemplate(template || null);
    setCampaign(prev => ({ ...prev, template_id: id }));
  };

  // Handle user selection
  const handleUserSelect = (userId: number, selected: boolean) => {
    setCampaign(prev => ({
      ...prev,
      targets: selected 
        ? [...prev.targets, userId]
        : prev.targets.filter(id => id !== userId)
    }));
  };

  // Handle select all users
  const handleSelectAllUsers = (selected: boolean) => {
    setCampaign(prev => ({
      ...prev,
      targets: selected ? users.map(u => u.id) : []
    }));
  };

  // Validate campaign data
  const validateCampaign = () => {
    if (!campaign.start_time) return { isValid: false, error: "Start time is required" };
    
    const startTime = new Date(campaign.start_time);
    const now = new Date();
    
    if (startTime < now) {
      return { isValid: false, error: "Start time must be in the future" };
    }
    
    return { isValid: true, error: null };
  };

  // Handle save campaign
  const handleSave = async () => {
    const validation = validateCampaign();
    if (!validation.isValid) {
      console.error("Validation failed:", validation.error);
      // You might want to show a toast notification here
      return;
    }

    setIsSaving(true);
    try {
      console.log("Creating campaign:", campaign);
      
      const response = await postRequest("campaign/campaigns", campaign, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      });
      
      console.log("Campaign created successfully:", response);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Optionally redirect to campaigns list or campaign view
      // router.push('/campaigns');
    } catch (error) {
      console.error("Campaign creation failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-lg">
                <MdCampaign className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Campaign Builder
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-gray-600">Create and launch targeted RCS campaigns</p>
                  <Badge 
                    color={getCompletionPercentage() === 100 ? "success" : "primary"} 
                    variant="flat"
                    className="animate-pulse"
                  >
                    <span className="text-gray-600">{getCompletionPercentage()}% Complete</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                color={saveSuccess ? "success" : "primary"}
                startContent={saveSuccess ? <MdCheckCircle /> : <MdSend />}
                onClick={handleSave}
                isLoading={isSaving}
                disabled={getCompletionPercentage() < 100}
                className={`shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                  saveSuccess 
                    ? "bg-gradient-to-r from-green-600 to-emerald-700" 
                    : "bg-gradient-to-r from-primary-600 to-primary-700"
                }`}
              >
                {saveSuccess ? "Created!" : isSaving ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress 
              value={getCompletionPercentage()} 
              className={`w-full ${getCompletionPercentage() === 100 ? 'progress-glow' : ''}`}
              color={getCompletionPercentage() === 100 ? "success" : "primary"}
              size="sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Basic Info */}
            <Card className="shadow-sm border border-gray-200/50 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center gap-2">
                  <MdInfo className="text-blue-200" />
                  <h3 className="text-xl font-semibold">Campaign Information</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Campaign Name"
                    placeholder="e.g., Summer Sale 2025"
                    value={campaign.name}
                    onValueChange={(value) => setCampaign(prev => ({ ...prev, name: value }))}
                    variant="bordered"
                    isRequired
                    endContent={campaign.name && <MdCheckCircle className="text-green-500" />}
                    classNames={{
                      label:"text-black"
                    }}
                  />
                  
                  <Select
                    label="Campaign Type"
                    placeholder="Select campaign type"
                    selectedKeys={campaign.campaign_type ? [campaign.campaign_type] : []}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      setCampaign(prev => ({ ...prev, campaign_type: key }));
                    }}
                    variant="bordered"
                    isRequired
                  >
                    {campaignTypes.map((type) => (
                      <SelectItem key={type.key}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    type="datetime-local"
                    label="Start Time"
                    value={campaign.start_time}
                    onValueChange={(value) => setCampaign(prev => ({ ...prev, start_time: value }))}
                    variant="bordered"
                    placeholder="1"
                    isRequired
                    min={new Date().toISOString().slice(0, 16)}
                    endContent={campaign.start_time && <MdCheckCircle className="text-green-500" />}
                    classNames={{
                      label:"text-black"
                    }}
                    description="Select when the campaign should start sending messages"
                  />
                </div>
              </CardBody>
            </Card>

            {/* Template Selection */}
            <Card className="shadow-sm border border-gray-200/50 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <div className="flex items-center gap-2">
                  <MdDescription className="text-green-200" />
                  <h3 className="text-xl font-semibold">Select Template</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {loadingTemplates ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading templates...</p>
                  </div>
                ) : (
                  <Select
                    label="Message Template"
                    placeholder="Choose a template for your campaign"
                    selectedKeys={campaign.template_id ? [campaign.template_id.toString()] : []}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      handleTemplateSelect(key);
                    }}
                    variant="bordered"
                    isRequired
                  >
                    {templates.map((template) => (
                      <SelectItem key={template.id.toString()}>
                        {template.name || `Template ${template.id}`} - {template.template_type}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                {selectedTemplate && (
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-2">Template Preview</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{selectedTemplate.content.text}</p>
                      {selectedTemplate.content.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTemplate.content.suggestions.map((suggestion: any, index: number) => (
                            <Chip key={index} size="sm" variant="flat" color="primary">
                              {suggestion.text}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Target Audience */}
            <Card className="shadow-sm border border-gray-200/50 bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <MdPeople className="text-purple-200" />
                    <h3 className="text-xl font-semibold">Target Audience</h3>
                  </div>
                  <Chip color="primary" variant="flat">
                    {campaign.targets.length} selected
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {loadingUsers ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-black mt-2">Loading users...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-black">
                      <Checkbox
                        isSelected={campaign.targets.length === users.length}
                        isIndeterminate={campaign.targets.length > 0 && campaign.targets.length < users.length}
                        onValueChange={handleSelectAllUsers}
                        classNames={

                        {
                          label:"text-black"
                        }
                        }
                      >
                        Select All ({users.length} users)
                      </Checkbox>
                    </div>
                    
                    <Divider />
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size="sm"
                              name={user.name}
                              className="bg-primary-100 text-primary-600"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <Checkbox
                            isSelected={campaign.targets.includes(user.id)}
                            onValueChange={(selected) => handleUserSelect(user.id, selected)}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Side - Campaign Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="shadow-lg border bg-white border-gray-200/50">
                <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <h3 className="text-lg font-semibold">Campaign Summary</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Campaign Name</p>
                      <p className="text-sm font-medium text-gray-700">{campaign.name || "Not set"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Type</p>
                      <p className="text-sm font-medium text-gray-700">{campaign.campaign_type || "Not selected"}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Template</p>
                      <p className="text-sm font-medium text-gray-700">
                        {selectedTemplate ? selectedTemplate.name || `Template ${selectedTemplate.id}` : "Not selected"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Target Audience</p>
                      <p className="text-sm font-medium text-gray-700">{campaign.targets.length} users selected</p>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {getCompletionPercentage()}%
                    </div>
                    <p className="text-xs text-gray-500">Configuration Complete</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreator;
