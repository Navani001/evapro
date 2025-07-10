import React from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { MdInfo, MdCheckCircle } from "react-icons/md";
import { Template, templateTypes, categories } from "./types";

interface TemplateBasicInfoProps {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
}

export const TemplateBasicInfo: React.FC<TemplateBasicInfoProps> = ({ 
  template, 
  setTemplate 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.01] card-hover">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <MdInfo className="text-blue-200" />
              Template Information
            </h3>
            <p className="text-blue-100">Set up the foundation of your RCS template</p>
          </div>
          {template.name && template.template_type && (
            <MdCheckCircle className="text-2xl text-green-300 animate-scale-in" />
          )}
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Template Name
              {template.name && <MdCheckCircle className="text-green-500 text-sm" />}
            </label>
            <Input
              placeholder="e.g., Welcome Message, Order Confirmation"
              value={template.name}
              onValueChange={(value) => setTemplate(prev => ({ ...prev, name: value }))}
              variant="bordered"
              classNames={{
                input: "text-gray-900",
                inputWrapper: `border-gray-300 hover:border-primary-400 focus-within:border-primary-500 transition-colors ${
                  template.name ? "border-green-300 bg-green-50" : ""
                }`
              }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              Template Type
              {template.template_type && <MdCheckCircle className="text-green-500 text-sm" />}
            </label>
            <Select
              placeholder="Choose template type"
              selectedKeys={[template.template_type]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string;
                setTemplate(prev => ({ ...prev, template_type: key }));
              }}
              variant="bordered"
              classNames={{
                trigger: `border-gray-300 hover:border-primary-400 focus:border-primary-500 transition-colors ${
                  template.template_type ? "border-green-300 bg-green-50" : ""
                }`
              }}
            >
              {templateTypes.map((type) => (
                <SelectItem key={type.key}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            Category
            {template.category && <MdCheckCircle className="text-green-500 text-sm" />}
          </label>
          <Select
            placeholder="Select message category"
            selectedKeys={[template.category]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;
              setTemplate(prev => ({ ...prev, category: key }));
            }}
            variant="bordered"
            classNames={{
              trigger: `border-gray-300 hover:border-primary-400 focus:border-primary-500 transition-colors ${
                template.category ? "border-green-300 bg-green-50" : ""
              }`
            }}
          >
            {categories.map((category) => (
              <SelectItem key={category.key}>
                {category.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};
