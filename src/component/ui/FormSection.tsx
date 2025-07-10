"use client";
import React from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({ title, description, children, className = "" }: FormSectionProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border-b border-gray-200 pb-3">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
