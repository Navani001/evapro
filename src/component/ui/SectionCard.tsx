"use client";
import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard = ({ title, description, children, className = "" }: SectionCardProps) => {
  return (
    <Card className={`border border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {children}
      </CardBody>
    </Card>
  );
};

export default SectionCard;
