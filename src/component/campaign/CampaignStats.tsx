"use client";
import React from "react";
import { MdCampaign } from "react-icons/md";

interface CampaignStatsProps {
  stats: {
    total: number;
    active: number;
    draft: number;
    completed: number;
  };
}

export const CampaignStats: React.FC<CampaignStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <MdCampaign className="text-blue-600 text-xl" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <div className="w-6 h-6 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Draft</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
