import React, { useState } from 'react';
import { Plus, Settings, ExternalLink, Calendar, Users, Activity } from 'lucide-react';
import CreateAppDialog from './CreateAppDialog';

interface App {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'developing';
  createdAt: string;
  users: number;
  integrations: number;
  category: string;
}

const AppsPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [apps, setApps] = useState<App[]>([
    {
      id: '1',
      name: 'TaskFlow Pro',
      description: 'Project management and team collaboration platform',
      status: 'active',
      createdAt: '2024-01-15',
      users: 1250,
      integrations: 8,
      category: 'Productivity'
    },
    {
      id: '2',
      name: 'DataViz Analytics',
      description: 'Business intelligence and data visualization tool',
      status: 'active',
      createdAt: '2024-02-20',
      users: 890,
      integrations: 12,
      category: 'Analytics'
    },
    {
      id: '3',
      name: 'ChatBot Builder',
      description: 'AI-powered customer service automation',
      status: 'developing',
      createdAt: '2024-03-10',
      users: 0,
      integrations: 3,
      category: 'AI/ML'
    }
  ]);

  const handleCreateApp = (newApp: Omit<App, 'id' | 'createdAt' | 'users' | 'integrations'>) => {
    const app: App = {
      ...newApp,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      users: 0,
      integrations: 0
    };
    setApps([...apps, app]);
    setIsCreateDialogOpen(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">My Applications</h1>
              <p className="mt-2 text-gray-400">Manage your SaaS applications and infrastructure</p>
            </div>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New App
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Apps</p>
                <p className="text-3xl font-bold text-white">{apps.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Users</p>
                <p className="text-3xl font-bold text-white">
                  {apps.reduce((sum, app) => sum + app.users, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Integrations</p>
                <p className="text-3xl font-bold text-white">
                  {apps.reduce((sum, app) => sum + app.integrations, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <ExternalLink className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 hover:bg-gray-900/70 transition-all duration-200 backdrop-blur-sm group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{app.description}</p>
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {new Date(app.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {app.users.toLocaleString()} users
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    {app.integrations} integrations
                  </div>
                </div>

                <div className="mb-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                    {app.category}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
                    View Dashboard
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-800 transition-all">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {apps.length === 0 && (
            <div className="col-span-full">
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                  <Plus className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
                <p className="text-gray-400 mb-6">Get started by creating your first SaaS application</p>
                <button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First App
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateAppDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateApp}
      />
    </div>
  );
};

export default AppsPage;

