"use client";
import React from "react";
import { Header } from "../header";
import { Navbar } from "../navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
  };
}

export const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} />
      
      {/* Sidebar Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
