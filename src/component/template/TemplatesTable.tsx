"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "../ui/DataTable";
import { Button } from "@heroui/react";
import { MdAdd, MdEdit, MdDelete, MdContentCopy, MdVisibility } from "react-icons/md";
import Link from "next/link";
import { getRequest } from "@/utils";

interface Template {
  id: number;
  brand_id: number;
  agent_id: number;
  name: string;
  template_type: string;
  category: string;
  status: string;
  content: {
    text: string;
    suggestions: any[];
  };
  variables: Record<string, string>;
  created_at: string;
  updated_at: string;
  agent: {
    id: number;
    name: string;
    display_name: string;
  };
  _count: {
    campaigns: number;
    messages: number;
  };
}

interface TemplatesTableProps {
  token?: string;
  brandId?: number;
}

export const TemplatesTable: React.FC<TemplatesTableProps> = ({ token, brandId = 1 }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const response = await getRequest(`template/brands/1/templates`, {
          Authorization: `Bearer ${token}`
        });
        console.log("Fetched templates:", response.data);
        const data = response.data as any;
        if (data) {
          setTemplates(data.templates);
          setPagination(prev => ({ 
            ...prev, 
            total: data.total,
            page: data.page 
          }));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
        setIsLoading(false);
      }
    };

    if (token && brandId) {
      fetchTemplates();
    }
  }, [token, brandId, pagination.page]);

  const columns = [
    { key: "name", label: "Template Name", sortable: true },
    { key: "template_type", label: "Type", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "content", label: "Content", sortable: false },
    { key: "variables", label: "Variables", sortable: false },
    { key: "agent", label: "Agent", sortable: false },
    { key: "_count", label: "Usage", sortable: false },
    { key: "updated_at", label: "Last Updated", sortable: true },
    { key: "actions", label: "Actions", sortable: false }
  ];

  const actions = [
    {
      key: "view",
      label: "View",
      icon: <MdVisibility />,
      color: "default" as const,
      onAction: (template: Template) => {
        console.log("View template:", template);
        // Navigate to view page
      }
    },
    {
      key: "edit",
      label: "Edit",
      icon: <MdEdit />,
      color: "primary" as const,
      onAction: (template: Template) => {
        console.log("Edit template:", template);
        // Navigate to edit page
      }
    },
    {
      key: "duplicate",
      label: "Duplicate",
      icon: <MdContentCopy />,
      color: "secondary" as const,
      onAction: (template: Template) => {
        console.log("Duplicate template:", template);
        // Create duplicate
      }
    },
    {
      key: "delete",
      label: "Delete",
      icon: <MdDelete />,
      color: "danger" as const,
      onAction: (template: Template) => {
        console.log("Delete template:", template);
        // Show confirmation dialog
      }
    }
  ];

  const handleRowClick = (template: Template) => {
    console.log("Row clicked:", template);
    // Navigate to template details
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
        <p className="text-gray-500 mb-6">Get started by creating your first RCS message template</p>
        <Link href="/templates/create">
          <Button color="primary" startContent={<MdAdd />}>
            Create Your First Template
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={templates}
        actions={actions}
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
