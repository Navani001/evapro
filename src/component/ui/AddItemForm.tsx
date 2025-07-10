"use client";
import React from "react";
import { Button, Input } from "@heroui/react";
import { MdAdd } from "react-icons/md";

interface AddItemFormProps {
  children: React.ReactNode;
  onAdd: () => void;
  disabled?: boolean;
  addButtonText?: string;
}

export const AddItemForm = ({ children, onAdd, disabled = false, addButtonText = "Add" }: AddItemFormProps) => {
  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1 flex gap-3">
        {children}
      </div>
      <Button
        color="primary"
        onClick={onAdd}
        disabled={disabled}
        className="shrink-0"
        startContent={<MdAdd />}
      >
        {addButtonText}
      </Button>
    </div>
  );
};

export default AddItemForm;
