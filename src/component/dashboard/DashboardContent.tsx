"use client";
import React from "react";
import { Button } from "@heroui/react";
import { MdMessage, MdAnalytics, MdCampaign, MdGroup } from "react-icons/md";
import Link from "next/link";

export const DashboardContent = () => {
  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-lg text-gray-600">
          Monitor your RCS campaigns and track engagement metrics.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MdCampaign className="text-2xl text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-green-600">↗ +2 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <MdMessage className="text-2xl text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">8,543</p>
              <p className="text-xs text-green-600">↗ +12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MdGroup className="text-2xl text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900">25,180</p>
              <p className="text-xs text-green-600">↗ +8% this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <MdAnalytics className="text-2xl text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">34.2%</p>
              <p className="text-xs text-red-600">↘ -2% from last week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all hover:scale-105">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
            <MdCampaign className="text-3xl text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Campaign</h3>
          <p className="text-gray-600 mb-4">Design and launch new RCS messaging campaigns to engage your customers with rich, interactive content.</p>
          <Button className="bg-primary-700 text-white hover:bg-primary-700 transition-colors w-full">
            New Campaign
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all hover:scale-105">
          <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
            <MdAnalytics className="text-3xl text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600 mb-4">View detailed analytics and insights about your RCS campaigns performance and user engagement.</p>
          <Button className="bg-success text-white hover:bg-success-dark transition-colors w-full">
            View Analytics
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all hover:scale-105">
          <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
            <MdMessage className="text-3xl text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Templates</h3>
          <p className="text-gray-600 mb-4">Create and manage reusable message templates for consistent branding across campaigns.</p>
          <Link href="/templates/create">
            <Button className="bg-accent-rose text-white hover:bg-accent-rose-dark transition-colors w-full">
              Manage Templates
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdCampaign className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New campaign "Summer Sale 2025" created</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <MdMessage className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">1,234 messages sent successfully</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdAnalytics className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Weekly analytics report generated</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
