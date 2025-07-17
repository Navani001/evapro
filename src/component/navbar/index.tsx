"use client";
import React from "react";
import { 
  MdDashboard, 
  MdCampaign, 
  MdMessage, 
  MdAnalytics, 
  MdGroup, 
  MdSettings,
  MdBusinessCenter
} from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: MdDashboard,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: MdCampaign,
  },
  // {
  //   name: "Messages",
  //   href: "/messages",
  //   icon: MdMessage,
  // },
  {
    name: "Templates",
    href: "/templates",
    icon: MdMessage,
  },
  // {
  //   name: "Analytics",
  //   href: "/analytics",
  //   icon: MdAnalytics,
  // },
  {
    name: "Audience",
    href: "/audience",
    icon: MdGroup,
  },
  {
    name: "Brand Management",
    href: "/brands",
    icon: MdBusinessCenter,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: MdSettings,
  },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-16 overflow-y-auto z-40">
      <div className="p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-primary-600 text-gray-700 border-r-2 border-primary-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon className={`text-lg ${isActive ? "text-gray-700" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              href="/campaigns/create"
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <MdCampaign className="text-lg" />
              New Campaign
            </Link>
            <Link
              href="/templates/create"
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <MdMessage className="text-lg" />
              Create Template
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
