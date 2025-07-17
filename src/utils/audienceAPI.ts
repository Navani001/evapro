// Frontend API service for audience/customer management

export interface AudienceUser {
  id: number;
  name: string;
  phone_number: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  subscriptions?: Array<{
    id: number;
    status: string;
    subscribed_at: string;
    unsubscribed_at?: string;
    brand: {
      name: string;
      display_name: string;
    };
    agent: {
      name: string;
      display_name: string;
    };
  }>;
  _count?: {
    messages: number;
  };
}

export interface AudienceResponse {
  users: AudienceUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserData {
  phone_number: string;
  name: string;
  country_code: string;
}

export interface AudienceFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export class AudienceService {
  private static baseUrl = '/api/userSub';

  /**
   * Create a new customer
   */
  static async createUser(
    brandId: string, 
    agentId: string, 
    userData: CreateUserData
  ): Promise<ApiResponse<AudienceUser>> {
    const response = await fetch(
      `${this.baseUrl}/brand/${brandId}/agent/${agentId}/users`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get all customers for a brand/agent
   */
  static async getUsers(
    brandId: string,
    agentId: string,
    filters: AudienceFilters = {}
  ): Promise<ApiResponse<AudienceResponse>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const url = `${this.baseUrl}/brand/${brandId}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get a customer by ID
   */
  static async getUser(userId: string): Promise<ApiResponse<AudienceUser>> {
    const response = await fetch(`${this.baseUrl}/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Update a customer - NOT IMPLEMENTED YET
   */
  static async updateUser(
    userId: string,
    userData: Partial<CreateUserData>
  ): Promise<ApiResponse<AudienceUser>> {
    // TODO: Implement update endpoint in backend
    throw new Error('Update user functionality not implemented yet');
  }

  /**
   * Delete a customer - NOT IMPLEMENTED YET
   */
  static async deleteUser(userId: string): Promise<ApiResponse<null>> {
    // TODO: Implement delete endpoint in backend
    throw new Error('Delete user functionality not implemented yet');
  }

  /**
   * Subscribe a customer - NOT IMPLEMENTED YET (users are auto-subscribed on creation)
   */
  static async subscribeUser(
    brandId: string,
    agentId: string,
    userId: string
  ): Promise<ApiResponse<any>> {
    // TODO: Implement if needed - users are auto-subscribed when added
    throw new Error('Subscribe functionality not needed - users are auto-subscribed on creation');
  }

  /**
   * Unsubscribe a customer
   */
  static async unsubscribeUser(
    brandId: string,
    agentId: string,
    userId: string
  ): Promise<ApiResponse<any>> {
    const response = await fetch(
      `${this.baseUrl}/${userId}/unsubscribe`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Export customers data - NOT IMPLEMENTED YET
   */
  static async exportUsers(
    brandId: string,
    agentId: string,
    format: 'csv' | 'xlsx' = 'csv'
  ): Promise<Blob> {
    // TODO: Implement export endpoint in backend
    throw new Error('Export functionality not implemented yet');
  }

  /**
   * Import customers from file
   */
  static async importUsers(
    brandId: string,
    agentId: string,
    file: File
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${this.baseUrl}/import`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Send message to a customer - NOT IMPLEMENTED YET
   */
  static async sendMessage(
    brandId: string,
    agentId: string,
    messageData: {
      recipientId: string;
      message: string;
      type?: 'text' | 'media';
    }
  ): Promise<ApiResponse<any>> {
    // TODO: Implement send message endpoint in backend
    throw new Error('Send message functionality not implemented yet');
  }
}

export default AudienceService;
