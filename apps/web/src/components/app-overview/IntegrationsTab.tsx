import React, { useState } from 'react';
import { Plus, Search, Filter, ExternalLink } from 'lucide-react';
import type { IntegrationI } from '../../type';

interface IntegrationsTabProps {
  integrations: IntegrationI[];
  setIntegrations: React.Dispatch<React.SetStateAction<IntegrationI[]>>;
}

const IntegrationsTab: React.FC<IntegrationsTabProps> = ({ integrations, setIntegrations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Communication', 'Finance', 'Storage', 'Analytics', 'Marketing'];

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(integrations =>
      integrations.map(integration =>
        integration.id === integrationId
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const enabledIntegrations = integrations.filter(i => i.enabled);
  const availableIntegrations = integrations.filter(i => !i.enabled);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Integrations</h3>
          <p className="text-gray-400 mt-1">Connect external services to enhance your application</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center shadow-lg hover:shadow-blue-500/25">
          <Plus className="w-4 h-4 mr-2" />
          Request Integration
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800">
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enabled Integrations */}
      {enabledIntegrations.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            Active Integrations ({enabledIntegrations.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enabledIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-sm p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 mr-4">
                      <span className="text-2xl">{integration.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-semibold">{integration.name}</h5>
                      <p className="text-gray-400 text-sm mt-1">{integration.description}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 mt-2">
                        {integration.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleIntegration(integration.id)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
          Available Integrations ({availableIntegrations.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.filter(i => !i.enabled).map((integration) => (
            <div
              key={integration.id}
              className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-sm p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 mr-4 group-hover:border-gray-600 transition-colors">
                    <span className="text-2xl">{integration.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-semibold group-hover:text-blue-400 transition-colors">{integration.name}</h5>
                    <p className="text-gray-400 text-sm mt-1">{integration.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                  {integration.category}
                </span>
                <button
                  onClick={() => toggleIntegration(integration.id)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Enable
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
            <Search className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No integrations found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default IntegrationsTab;

