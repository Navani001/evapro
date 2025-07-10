import React from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { Template, TemplateVariable, variableTypes } from "./types";

interface TemplateVariablesProps {
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
  newVariable: TemplateVariable;
  setNewVariable: React.Dispatch<React.SetStateAction<TemplateVariable>>;
  addVariable: () => void;
  removeVariable: (varName: string) => void;
}

export const TemplateVariables: React.FC<TemplateVariablesProps> = ({ 
  template,
  setTemplate,
  newVariable,
  setNewVariable,
  addVariable,
  removeVariable
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Dynamic Variables</h3>
        <p className="text-purple-100">Add personalization with dynamic data</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase">Variable Name</label>
            <Input
              placeholder="name, balance, orderID..."
              value={newVariable.name}
              onValueChange={(value) => setNewVariable(prev => ({ ...prev, name: value }))}
              variant="bordered"
              size="sm"
            />
          </div>
          <div className="w-32 space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase">Type</label>
            <Select
              classNames={{
                value: "!text-gray-900",
                mainWrapper: "!border-gray-900"
              }}
              placeholder="Type"
              selectedKeys={[newVariable.type]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as "String" | "Integer" | "Boolean" | "Float";
                setNewVariable(prev => ({ ...prev, type: key }));
              }}
              variant="bordered"
              size="sm"
            >
              {variableTypes.map((type) => (
                <SelectItem key={type.key}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              color="primary"
              onClick={addVariable}
              disabled={!newVariable.name || !newVariable.type}
              className="bg-gradient-to-r from-purple-600 to-violet-600"
              startContent={<MdAdd />}
            >
              Add
            </Button>
          </div>
        </div>

        {Object.keys(template.variables).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Active Variables</h4>
            {Object.entries(template.variables).map(([name, type]) => (
              <div key={name} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg text-white text-xs font-mono">
                    {`{{${name}}}`}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{name}</span>
                    <span className="text-sm text-purple-600 ml-2">({type})</span>
                  </div>
                </div>
                <Button
                  color="danger"
                  variant="light"
                  isIconOnly
                  size="sm"
                  onClick={() => removeVariable(name)}
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
