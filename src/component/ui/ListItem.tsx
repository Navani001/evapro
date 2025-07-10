"use client";
import React from "react";
import { Button } from "@heroui/react";
import { MdDelete } from "react-icons/md";

interface ListItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
}

export const ListItem = ({ children, onDelete, className = "" }: ListItemProps) => {
  return (
    <div className={`flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors ${className}`}>
      <div className="flex-1">
        {children}
      </div>
      {onDelete && (
        <Button
          color="danger"
          variant="light"
          isIconOnly
          size="sm"
          onClick={onDelete}
          className="ml-3"
        >
          <MdDelete />
        </Button>
      )}
    </div>
  );
};

export default ListItem;
