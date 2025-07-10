import React from "react";
import { Textarea } from "@heroui/react";
import { MdPreview, MdCheckCircle, MdInfo } from "react-icons/md";
import { Template } from "./types";

interface TemplateMessageContentProps {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
}

export const TemplateMessageContent: React.FC<TemplateMessageContentProps> = ({ 
  template, 
  setTemplate 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.01] card-hover">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <MdPreview className="text-green-200" />
              Message Content
            </h3>
            <p className="text-green-100">Craft your message with dynamic variables</p>
          </div>
          {template.content.text && (
            <MdCheckCircle className="text-2xl text-green-300 animate-scale-in" />
          )}
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            Message Text
            {template.content.text && <MdCheckCircle className="text-green-500 text-sm" />}
          </label>
          <Textarea
            placeholder="Hi {{name}}, welcome to our service! Your account balance is {{balance}}. How can we help you today?"
            value={template.content.text}
            onValueChange={(value) => setTemplate(prev => ({
              ...prev,
              content: { ...prev.content, text: value }
            }))}
            minRows={4}
            variant="bordered"
            classNames={{
              input: "text-gray-900",
              inputWrapper: `border-gray-300 hover:border-primary-400 focus-within:border-primary-500 transition-colors ${
                template.content.text ? "border-green-300 bg-green-50" : ""
              }`
            }}
          />
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <MdInfo className="text-primary-500" />
            Character count: {template.content.text.length}/1000
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white text-sm">💡</div>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Pro Tip</p>
              <p className="text-sm text-blue-800">
                Use {`{{variableName}}`} syntax for dynamic content. Create variables below and they'll automatically appear in your preview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
