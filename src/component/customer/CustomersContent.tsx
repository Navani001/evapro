"use client";

import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Card, 
  CardBody,
  Pagination,
  useDisclosure
} from '@heroui/react';
import { Search, Plus, Filter, Download, Upload } from 'lucide-react';
import CustomerCreator from './CustomerCreator';
import CustomersTable from './CustomersTable';
import CustomerStats from './CustomerStats';
import ImportContactsModal from './ImportContactsModal';
import SendMessageModal from './SendMessageModal';
import { 
  AudienceUser, 
  AudienceFilters,
  CreateUserData,
  subscriptionStatuses 
} from './types';
import { AudienceService } from '@/utils/audienceAPI';

interface CustomersContentProps {
  brandId: string;
  agentId: string;
}

const CustomersContent: React.FC<CustomersContentProps> = ({
  brandId,
  agentId
}) => {
  const [customers, setCustomers] = useState<AudienceUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<AudienceFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: ''
  });
  const [stats, setStats] = useState({
    totalCustomers: 0,
    subscribedCustomers: 0,
    unsubscribedCustomers: 0,
    totalMessages: 0
  });
  const [selectedCustomer, setSelectedCustomer] = useState<AudienceUser | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const importModal = useDisclosure();
  const messageModal = useDisclosure();

  // API functions
  const fetchCustomers = async (currentFilters: AudienceFilters) => {
    setIsLoading(true);
    try {
      const response = await AudienceService.getUsers(brandId, agentId, currentFilters);
      if (response.success) {
        setCustomers(response.data.users);
        setPagination(response.data.pagination);
        calculateStats(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Set empty data on error
      setCustomers([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
      setStats({
        totalCustomers: 0,
        subscribedCustomers: 0,
        unsubscribedCustomers: 0,
        totalMessages: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (customerData: AudienceUser[]) => {
    const totalCustomers = customerData.length;
    const subscribedCustomers = customerData.filter(customer => 
      customer.subscriptions?.some((sub: any) => sub.status === 'subscribed')
    ).length;
    const unsubscribedCustomers = customerData.filter(customer => 
      customer.subscriptions?.some((sub: any) => sub.status === 'unsubscribed')
    ).length;
    const totalMessages = customerData.reduce((sum, customer) => 
      sum + (customer._count?.messages || 0), 0
    );

    setStats({
      totalCustomers,
      subscribedCustomers,
      unsubscribedCustomers,
      totalMessages
    });
  };

  const handleCreateCustomer = async (data: CreateUserData) => {
    setIsCreating(true);
    try {
      const response = await AudienceService.createUser(brandId, agentId, data);
      if (response.success) {
        // Refresh customers list
        await fetchCustomers(filters);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    fetchCustomers(newFilters);
  };

  const handleStatusFilter = (status: string) => {
    const newFilters = { ...filters, status, page: 1 };
    setFilters(newFilters);
    fetchCustomers(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchCustomers(newFilters);
  };

  const handleExport = async () => {
    try {
      const blob = await AudienceService.exportUsers(brandId, agentId, 'csv');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers-${brandId}-${agentId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleEditCustomer = async (customer: AudienceUser) => {
    // TODO: Implement edit modal
    console.log('Edit customer:', customer);
  };

  const handleDeleteCustomer = async (customer: AudienceUser) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await AudienceService.deleteUser(customer.id.toString());
        await fetchCustomers(filters); // Refresh list
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleUnsubscribeCustomer = async (customer: AudienceUser) => {
    if (confirm(`Are you sure you want to unsubscribe ${customer.name}?`)) {
      try {
        await AudienceService.unsubscribeUser(brandId, agentId, customer.id.toString());
        await fetchCustomers(filters); // Refresh list
      } catch (error) {
        console.error('Error unsubscribing customer:', error);
      }
    }
  };

  const handleMessageCustomer = async (customer: AudienceUser) => {
    setSelectedCustomer(customer);
    messageModal.onOpen();
  };

  const handleImportComplete = () => {
    fetchCustomers(filters); // Refresh list after import
  };

  const handleMessageSent = () => {
    fetchCustomers(filters); // Refresh list after sending message
  };

  useEffect(() => {
    fetchCustomers(filters);
  }, [brandId, agentId]);

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <CustomerStats
        totalCustomers={stats.totalCustomers}
        subscribedCustomers={stats.subscribedCustomers}
        unsubscribedCustomers={stats.unsubscribedCustomers}
        totalMessages={stats.totalMessages}
        isLoading={isLoading}
      />

      {/* Controls Section */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                placeholder="Search customers by name or phone..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                className="sm:max-w-sm"
              />
              
              <Select
                placeholder="Filter by status"
                selectedKeys={filters.status ? [filters.status] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleStatusFilter(value || '');
                }}
                startContent={<Filter className="w-4 h-4" />}
                className="sm:max-w-xs"
              >
                {subscriptionStatuses.map((status) => 
                  <SelectItem key={status.key}>
                    {status.label}
                  </SelectItem>
                )}
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="bordered"
                startContent={<Upload className="w-4 h-4" />}
                onPress={importModal.onOpen}
              >
                Import
              </Button>
              <Button
                variant="bordered"
                startContent={<Download className="w-4 h-4" />}
                onPress={handleExport}
              >
                Export
              </Button>
              <Button
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onPress={onOpen}
              >
                Add Customer
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table Section */}
      <Card>
        <CardBody className="p-0">
          <CustomersTable
            customers={customers}
            isLoading={isLoading}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onUnsubscribe={handleUnsubscribeCustomer}
            onMessage={handleMessageCustomer}
          />
        </CardBody>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            showControls
          />
        </div>
      )}

      {/* Create Customer Modal */}
      <CustomerCreator
        isOpen={isOpen}
        onClose={onClose}
        onCustomerCreate={handleCreateCustomer}
        isLoading={isCreating}
      />

      {/* Import Contacts Modal */}
      <ImportContactsModal
        isOpen={importModal.isOpen}
        onClose={importModal.onClose}
        brandId={brandId}
        agentId={agentId}
        onImportComplete={handleImportComplete}
      />

      {/* Send Message Modal */}
      <SendMessageModal
        isOpen={messageModal.isOpen}
        onClose={messageModal.onClose}
        customer={selectedCustomer}
        brandId={brandId}
        agentId={agentId}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default CustomersContent;
