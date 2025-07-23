import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Settings,
  Shield,
  Zap,
  Bell,
  Database
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { AppI, AuthProviderI, IntegrationI } from '../type';
import OverviewTab from '../components/app-overview/OverviewTab';
import AuthenticationTab from '../components/app-overview/AuthenticationTab';
import IntegrationsTab from '../components/app-overview/IntegrationsTab';
import NotificationsTab from '../components/app-overview/NotificationsTab';
import StorageTab from '../components/app-overview/StorageTab';

const AppDetails: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState('overview');

  const [app] = useState<AppI>({
    id: appId || '1',
    name: 'TaskFlow Pro',
    description: 'A comprehensive project management and team collaboration platform designed to streamline workflows and boost productivity.',
    status: 'active',
    createdAt: '2024-01-15',
    users: 1250,
    integrations: 8,
    category: 'Productivity'
  });

  const [authProviders, setAuthProviders] = useState<AuthProviderI[]>([
    { id: 'google', name: 'Google', enabled: true, clientId: 'client_123...', clientSecret: 'secret_456...', icon: '🔵' },
    { id: 'github', name: 'GitHub', enabled: true, clientId: 'client_789...', clientSecret: 'secret_012...', icon: '⚫' },
    { id: 'microsoft', name: 'Microsoft', enabled: false, icon: '🔷' },
    { id: 'facebook', name: 'Facebook', enabled: false, icon: '🔵' },
  ]);

  const [integrations, setIntegrations] = useState<IntegrationI[]>([
    { id: 'slack', name: 'Slack', description: 'Team communication', category: 'Communication', enabled: true, icon: '💬' },
    { id: 'stripe', name: 'Stripe', description: 'Payment processing', category: 'Finance', enabled: true, icon: '💳' },
    { id: 'sendgrid', name: 'SendGrid', description: 'Email delivery', category: 'Communication', enabled: false, icon: '📧' },
    { id: 'aws-s3', name: 'AWS S3', description: 'File storage', category: 'Storage', enabled: true, icon: '☁️' },
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'auth', label: 'Authentication', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'storage', label: 'Storage', icon: Database },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/20 text-green-400 border-green-800/30';
      case 'inactive':
        return 'bg-red-900/20 text-red-400 border-red-800/30';
      case 'developing':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-800/30';
      default:
        return 'bg-gray-800/50 text-gray-400 border-gray-700';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab app={app} authProviders={authProviders} getStatusColor={getStatusColor} />;
      case 'auth':
        return <AuthenticationTab authProviders={authProviders} setAuthProviders={setAuthProviders} />;
      case 'integrations':
        return <IntegrationsTab integrations={integrations} setIntegrations={setIntegrations} />;
      case 'notifications':
        return <NotificationsTab />;
      case 'storage':
        return <StorageTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">{app.name}</h1>
                <p className="text-gray-400 mt-1">Configure your application settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-800">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
