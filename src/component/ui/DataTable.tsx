import React from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Pagination
} from "@heroui/react";
import { 
  MdMoreVert, 
  MdEdit, 
  MdDelete, 
  MdContentCopy, 
  MdVisibility,
  MdCalendarToday,
  MdCategory,
  MdTextFields
} from "react-icons/md";

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

interface TableAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  onAction: (item: any) => void;
}

interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  isLoading?: boolean;
  emptyContent?: React.ReactNode;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (item: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  actions = [],
  isLoading = false,
  emptyContent,
  pagination,
  onRowClick
}) => {
  const renderCell = (item: any, columnKey: string) => {
    const value = item[columnKey];
    
    // Handle different data types
    switch (columnKey) {
      case 'actions':
        // Don't render actions directly in the cell, they're handled in the TableCell
        return null;
      
      case 'campaign_type':
        return (
          <Chip
            color={
              value === 'promotional' ? 'warning' :
              value === 'transactional' ? 'success' :
              value === 'broadcast' ? 'primary' :
              value === 'targeted' ? 'secondary' : 'default'
            }
            variant="flat"
            size="sm"
          >
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </Chip>
        );
      
      case 'targets':
        if (Array.isArray(value)) {
          return (
            <Chip color="primary" variant="flat" size="sm">
              {value.length} target{value.length !== 1 ? 's' : ''}
            </Chip>
          );
        }
        return <span className="text-sm text-gray-600">{value || 'N/A'}</span>;
      
      case 'template':
        return (
          <div className="max-w-xs">
            <p className="text-sm font-medium text-gray-900 truncate">
              {value?.name || `Template ${value?.id}` || 'No template'}
            </p>
            <p className="text-xs text-gray-500">{value?.template_type}</p>
          </div>
        );
      
      case 'status':
        return (
          <Chip
            color={
              value === 'valid' ? 'success' :
              value === 'draft' ? 'warning' :
              value === 'invalid' ? 'danger' : 'default'
            }
            variant="flat"
            size="sm"
          >
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </Chip>
        );
      
      case 'agent':
        return (
          <div className="flex items-center gap-2">
            <Avatar
              size="sm"
              name={value?.display_name || value?.name}
              className="bg-primary-100 text-primary-600"
            />
            <span className="text-sm text-gray-700">
              {value?.display_name || value?.name || 'Unknown'}
            </span>
          </div>
        );
      
      case '_count':
        return (
          <div className="text-sm text-gray-600">
            <div>Campaigns: {value?.campaigns || 0}</div>
            <div className="text-xs text-gray-400">Messages: {value?.messages || 0}</div>
          </div>
        );
      
      case 'name':
        return (
          <div>
            <span className="text-sm font-medium text-gray-900">
              {value || 'Untitled Template'}
            </span>
          </div>
        );
      
      case 'template_type':
        return (
          <Chip
            color={
              value === 'text' ? 'primary' :
              value === 'media' ? 'secondary' :
              value === 'carousel' ? 'success' : 'default'
            }
            variant="flat"
            size="sm"
            startContent={<MdTextFields className="text-xs" />}
          >
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </Chip>
        );
      
      case 'category':
        return (
          <Chip
            color={
              value === 'promotional' ? 'warning' :
              value === 'transactional' ? 'success' :
              value === 'notification' ? 'secondary' : 'default'
            }
            variant="flat"
            size="sm"
            startContent={<MdCategory className="text-xs" />}
          >
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </Chip>
        );
      
      case 'created_at':
      case 'updated_at':
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MdCalendarToday className="text-xs" />
            {value ? new Date(value).toLocaleDateString() : 'N/A'}
          </div>
        );
      
      case 'content':
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-600 truncate">
              {value?.text || 'No content'}
            </p>
            {value?.suggestions?.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {value.suggestions.length} suggestion{value.suggestions.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        );
      
      case 'variables':
        const variableCount = value ? Object.keys(value).length : 0;
        return (
          <Chip
            color={variableCount > 0 ? 'primary' : 'default'}
            variant="flat"
            size="sm"
          >
            {variableCount} variable{variableCount !== 1 ? 's' : ''}
          </Chip>
        );
      
      default:
        return (
          <span className="text-sm text-gray-900">
            {value || 'N/A'}
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      <Table 
        aria-label="Data table"
        isStriped
        selectionMode="none"
        className="min-h-[400px] bg-white"
        classNames={{
            table:"bg-white hh",
            
            base:"bg-white gg",
          wrapper: "shadow-sm ggcf border border-gray-200 p-0 border-0",
          th: "bg-gray-50 text-gray-700 font-semibold",
          td: "py-4"
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={column.sortable ? "cursor-pointer hover:bg-gray-100" : ""}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data}
          isLoading={isLoading}
          loadingContent={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          }
          emptyContent={
            emptyContent || (
              <div className="text-center py-8">
                <p className="text-gray-500">No data available</p>
              </div>
            )
          }
        >
          {(item) => (
            <TableRow
              key={item.id || item.name}
              className={`${
                onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
              } transition-colors`}
              onClick={() => onRowClick?.(item)}
            >
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'actions' ? (
                    // Handle actions column specially
                    <div className="flex justify-end">
                      {/* Use actions from row data if available, otherwise use global actions */}
                      {((item.actions && item.actions.length > 0) || actions.length > 0) && (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-gray-400 hover:text-gray-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MdMoreVert />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Actions">
                            {/* Use row-specific actions if available, otherwise global actions */}
                            {(item.actions || actions).map((action: TableAction) => (
                              <DropdownItem
                                key={action.key}
                                startContent={action.icon}
                                color={action.color}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onAction(item);
                                }}
                              >
                                {action.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </div>
                  ) : (
                    // Regular columns
                    renderCell(item, columnKey as string)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={Math.ceil(pagination.total / pagination.pageSize)}
            page={pagination.page}
            onChange={pagination.onPageChange}
            showControls
            showShadow
            color="primary"
          />
        </div>
      )}
    </div>
  );
};
