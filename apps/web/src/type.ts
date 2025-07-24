export interface AppI {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'developing';
  createdAt: string;
  users: number;
  integrations: number;
  category: string;
}

export interface AuthProviderI {
  id: string;
  name: string;
  enabled: boolean;
  clientID?: string;
  clientSecret?: string;
  icon: string;
}

export interface IntegrationI {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  icon: string;
}

export interface NotificationSettingI {
  id: string;
  type: 'email' | 'sms' | 'webhook';
  enabled: boolean;
  endpoint?: string;
  events: string[];
}

export interface StorageConfigI {
  id: string;
  type: 'database' | 'file_storage' | 'cache';
  provider: string;
  enabled: boolean;
  configuration: Record<string, any>;
}

