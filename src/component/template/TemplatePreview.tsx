import React from "react";
import { Button, Input } from "@heroui/react";
import { MdSmartphone, MdCode, MdContentCopy, MdDownload } from "react-icons/md";
import { PreviewPhone } from "../ui/PreviewPhone";
import { MessageBubble } from "../ui/MessageBubble";
import { Template } from "./types";

interface TemplatePreviewProps {
  template: Template;
  previewData: Record<string, any>;
  setPreviewData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  getPreviewText: () => string;
  generateJSON: () => string;
  handleCopyJSON: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  previewData,
  setPreviewData,
  getPreviewText,
  generateJSON,
  handleCopyJSON
}) => {
  return (
    <div className="sticky top-32 space-y-6 animate-slide-up">
      {/* Live Preview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden card-hover">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <MdSmartphone className="text-gray-200" />
            Live Preview
          </h3>
          <p className="text-gray-300 text-sm">Real-time message preview</p>
        </div>
        <div className="p-6">
          {/* Preview Data Inputs */}
          {Object.keys(template.variables).length > 0 && (
            <div className="space-y-3 mb-6 animate-fade-in">
              <p className="text-sm font-medium text-gray-700">Test Data:</p>
              {Object.keys(template.variables).map((varName) => (
                <Input
                  key={varName}
                  label={varName}
                  placeholder={`Sample ${varName}`}
                  value={previewData[varName] || ""}
                  onValueChange={(value) => setPreviewData(prev => ({ ...prev, [varName]: value }))}
                  size="sm"
                  variant="bordered"
                  className="animate-slide-up"
                />
              ))}
            </div>
          )}

          <div className="phone-glow">
            <PreviewPhone>
              <MessageBubble
                text={getPreviewText()}
                suggestions={template.content.suggestions}
              />
            </PreviewPhone>
          </div>
        </div>
      </div>

      {/* JSON Export */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 text-white">
          <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <MdCode className="text-green-200" />
            JSON Export
          </h3>
          <p className="text-green-100 text-sm">Ready for API integration</p>
        </div>
        <div className="p-4">
          <div className="bg-gray-900 rounded-lg p-4 mb-4 relative group">
            <pre className="text-green-400 text-xs overflow-auto max-h-48 font-mono">
              {generateJSON()}
            </pre>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onClick={handleCopyJSON}
                className="text-green-400 hover:text-green-300"
              >
                <MdContentCopy />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="bordered"
              onClick={handleCopyJSON}
              className="flex-1 text-xs hover:scale-105 transition-transform !text-gray-900"
              startContent={<MdContentCopy />}
            >
              Copy
            </Button>
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                const blob = new Blob([generateJSON()], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${template.name || 'template'}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 text-xs hover:scale-105 transition-transform"
              startContent={<MdDownload />}
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
