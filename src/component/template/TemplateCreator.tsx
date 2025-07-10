"use client";
import React, { useState, useEffect } from "react";
import { Button, Progress, Badge, Tooltip } from "@heroui/react";
import { 
  MdSettings, 
  MdCheckCircle,
  MdSave, 
  MdContentCopy,
  MdSmartphone
} from "react-icons/md";
import { postRequest } from "@/utils";
import { TemplateBasicInfo } from "./TemplateBasicInfo";
import { TemplateMessageContent } from "./TemplateMessageContent";
import { TemplateVariables } from "./TemplateVariables";
import { TemplateSuggestions } from "./TemplateSuggestions";
import { TemplatePreview } from "./TemplatePreview";

interface Suggestion {
  text: string;
  postbackData: string;
}

interface TemplateVariable {
  name: string;
  type: "String" | "Integer" | "Boolean" | "Float";
}

interface TemplateContent {
  text: string;
  suggestions: Suggestion[];
}

interface Template {
  template_type: string;
  name: string;
  content: TemplateContent;
  variables: Record<string, string>;
  category: string;
}

const templateTypes = [
  { key: "text", label: "Text Template" },
  { key: "media", label: "Media Template" },
  { key: "carousel", label: "Carousel Template" },
];

const categories = [
  { key: "conversational", label: "Conversational" },
  { key: "promotional", label: "Promotional" },
  { key: "transactional", label: "Transactional" },
  { key: "notification", label: "Notification" },
];

const variableTypes = [
  { key: "String", label: "String" },
  { key: "Integer", label: "Integer" },
  { key: "Boolean", label: "Boolean" },
  { key: "Float", label: "Float" },
];

interface TemplateCreatorProps {
  token: string;
}

export const TemplateCreator: React.FC<TemplateCreatorProps> = ({ token }) => {
  const [template, setTemplate] = useState<Template>({
    template_type: "text",
    name: "",
    content: {
      text: "",
      suggestions: []
    },
    variables: {},
    category: "conversational"
  });

  const [newSuggestion, setNewSuggestion] = useState<Suggestion>({
    text: "",
    postbackData: ""
  });

  const [newVariable, setNewVariable] = useState<TemplateVariable>({
    name: "",
    type: "String"
  });

  const [previewData, setPreviewData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 4;

    if (template.name.trim()) completed++;
    if (template.content.text.trim()) completed++;
    if (template.template_type) completed++;
    if (template.category) completed++;

    return Math.round((completed / total) * 100);
  };

  // Auto-generate sample data for variables
  useEffect(() => {
    const sampleData: Record<string, any> = {};
    Object.keys(template.variables).forEach(varName => {
      const type = template.variables[varName];
      switch (type) {
        case "String":
          sampleData[varName] = varName === "name" ? "John Doe" : `Sample ${varName}`;
          break;
        case "Integer":
          sampleData[varName] = "123";
          break;
        case "Boolean":
          sampleData[varName] = "true";
          break;
        case "Float":
          sampleData[varName] = "99.99";
          break;
        default:
          sampleData[varName] = `Sample ${varName}`;
      }
    });
    setPreviewData(sampleData);
  }, [template.variables]);

  // Add suggestion
  const addSuggestion = () => {
    if (newSuggestion.text && newSuggestion.postbackData) {
      setTemplate(prev => ({
        ...prev,
        content: {
          ...prev.content,
          suggestions: [...prev.content.suggestions, { ...newSuggestion }]
        }
      }));
      setNewSuggestion({ text: "", postbackData: "" });
    }
  };

  // Remove suggestion
  const removeSuggestion = (index: number) => {
    setTemplate(prev => ({
      ...prev,
      content: {
        ...prev.content,
        suggestions: prev.content.suggestions.filter((_, i) => i !== index)
      }
    }));
  };

  // Add variable
  const addVariable = () => {
    if (newVariable.name && newVariable.type) {
      setTemplate(prev => ({
        ...prev,
        variables: {
          ...prev.variables,
          [newVariable.name]: newVariable.type
        }
      }));
      setNewVariable({ name: "", type: "String" });
    }
  };

  // Remove variable
  const removeVariable = (varName: string) => {
    setTemplate(prev => {
      const newVariables = { ...prev.variables };
      delete newVariables[varName];
      return {
        ...prev,
        variables: newVariables
      };
    });
  };

  // Preview text with variables replaced
  const getPreviewText = () => {
    let text = template.content.text;
    Object.keys(template.variables).forEach(varName => {
      const placeholder = `{{${varName}}}`;
      const value = previewData[varName] || `[${varName}]`;
      text = text.replace(new RegExp(placeholder, 'g'), value);
    });
    return text;
  };

  // Generate JSON
  const generateJSON = () => {
    return JSON.stringify(template, null, 2);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("Saving template:", template);
      
      const response = await postRequest("template/template", template, {
        Authorization: `Bearer ${token}`,
      });
      
      console.log("Template saved successfully:", response);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(generateJSON());
      // You could add a toast notification here
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Modern Header with Progress */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-lg">
                <MdSettings className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  RCS Template Builder
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-gray-600">Create engaging RCS messages with rich content and interactions</p>
                  <Badge 
                    color={getCompletionPercentage() === 100 ? "success" : "primary"} 
                    variant="flat"
                    className="animate-pulse"
                  >
                    <span className="text-gray-600">{getCompletionPercentage()}% Complete</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Tooltip content="Copy template JSON to clipboard">
                <Button
                  color="default"
                  variant="bordered"
                  startContent={<MdContentCopy />}
                  onClick={handleCopyJSON}
                  className="border-gray-300 hover:border-primary-400 hover:text-primary-600 transition-all duration-200 hover:scale-105 !text-gray-900"
                >
                  Export JSON
                </Button>
              </Tooltip>
              <Button
                color={saveSuccess ? "success" : "primary"}
                startContent={saveSuccess ? <MdCheckCircle /> : <MdSave />}
                onClick={handleSave}
                isLoading={isSaving}
                className={`shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                  saveSuccess 
                    ? "bg-gradient-to-r from-green-600 to-emerald-700" 
                    : "bg-gradient-to-r from-primary-600 to-primary-700"
                }`}
              >
                {saveSuccess ? "Saved!" : isSaving ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress 
              value={getCompletionPercentage()} 
              className={`w-full ${getCompletionPercentage() === 100 ? 'progress-glow' : ''}`}
              color={getCompletionPercentage() === 100 ? "success" : "primary"}
              size="sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto py-8">
        {/* Enhanced Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></div>
              <MdSmartphone className="text-primary-500" />
              <span className="text-sm font-medium text-gray-700">Design Phase</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Form Sections */}
          <div className="xl:col-span-3 space-y-8 animate-fade-in">
            <TemplateBasicInfo 
              template={template} 
              setTemplate={setTemplate} 
            />
            
            <TemplateMessageContent 
              template={template} 
              setTemplate={setTemplate} 
            />

            <TemplateVariables
              template={template}
              setTemplate={setTemplate}
              newVariable={newVariable}
              setNewVariable={setNewVariable}
              addVariable={addVariable}
              removeVariable={removeVariable}
            />

            <TemplateSuggestions
              template={template}
              newSuggestion={newSuggestion}
              setNewSuggestion={setNewSuggestion}
              addSuggestion={addSuggestion}
              removeSuggestion={removeSuggestion}
            />
          </div>

          {/* Right Sidebar - Preview & JSON */}
          <div className="xl:col-span-1">
            <TemplatePreview
              template={template}
              previewData={previewData}
              setPreviewData={setPreviewData}
              getPreviewText={getPreviewText}
              generateJSON={generateJSON}
              handleCopyJSON={handleCopyJSON}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreator;
