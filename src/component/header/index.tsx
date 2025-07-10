"use client";
import React from "react";
import { MdMessage, MdNotifications, MdAccountCircle } from "react-icons/md";
import { SignOut } from "@/component";

interface HeaderProps {
  user?: {
    name?: string;
    email?: string;
  };
}

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MdMessage className="text-2xl text-blue-700" />
              <h1 className="text-xl font-bold text-gray-900">RCS Platform</h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MdNotifications className="text-xl" />
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <MdAccountCircle className="text-2xl text-gray-400" />
                <SignOut />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
