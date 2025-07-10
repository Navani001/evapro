import React from "react";
import { Button, Input } from "@heroui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { Template, Suggestion } from "./types";

interface TemplateSuggestionsProps {
  template: Template;
  newSuggestion: Suggestion;
  setNewSuggestion: React.Dispatch<React.SetStateAction<Suggestion>>;
  addSuggestion: () => void;
  removeSuggestion: (index: number) => void;
}

export const TemplateSuggestions: React.FC<TemplateSuggestionsProps> = ({ 
  template,
  newSuggestion,
  setNewSuggestion,
  addSuggestion,
  removeSuggestion
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Quick Reply Buttons</h3>
        <p className="text-orange-100">Add interactive buttons for user actions</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase">Button Text</label>
            <Input
              placeholder="Recharge Now, Contact Support..."
              value={newSuggestion.text}
              onValueChange={(value) => setNewSuggestion(prev => ({ ...prev, text: value }))}
              variant="bordered"
              size="sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase">Action Data</label>
            <Input
              placeholder="action=recharge, support=chat..."
              value={newSuggestion.postbackData}
              onValueChange={(value) => setNewSuggestion(prev => ({ ...prev, postbackData: value }))}
              variant="bordered"
              size="sm"
            />
          </div>
          <div className="md:col-span-2">
            <Button
              color="primary"
              onClick={addSuggestion}
              disabled={!newSuggestion.text || !newSuggestion.postbackData}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
              startContent={<MdAdd />}
            >
              Add Button
            </Button>
          </div>
        </div>

        {template.content.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Active Buttons</h4>
            {template.content.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
                      {suggestion.text}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{suggestion.postbackData}</p>
                </div>
                <Button
                  color="danger"
                  variant="light"
                  isIconOnly
                  size="sm"
                  onClick={() => removeSuggestion(index)}
                >
                  <MdDelete />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
