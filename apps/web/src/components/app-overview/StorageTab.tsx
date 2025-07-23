import React, { useState } from 'react';
import { Database, HardDrive, Cloud, Settings, Plus, Save, Activity } from 'lucide-react';

interface StorageConfig {
  id: string;
  type: 'database' | 'file_storage' | 'cache';
  provider: string;
  enabled: boolean;
  configuration: Record<string, any>;
  usage?: {
    used: number;
    total: number;
    unit: string;
  };
}

const StorageTab: React.FC = () => {
  const [storageConfigs, setStorageConfigs] = useState<StorageConfig[]>([
    {
      id: 'postgres',
      type: 'database',
      provider: 'PostgreSQL',
      enabled: true,
      configuration: {
        host: 'localhost',
        port: 5432,
        database: 'taskflow_prod',
        maxConnections: 100
      },
      usage: { used: 2.4, total: 10, unit: 'GB' }
    },
    {
      id: 'aws-s3',
      type: 'file_storage',
      provider: 'AWS S3',
      enabled: true,
      configuration: {
        bucket: 'taskflow-files',
        region: 'us-west-2',
        encryption: true
      },
      usage: { used: 450, total: 1000, unit: 'GB' }
    },
    {
      id: 'redis',
      type: 'cache',
      provider: 'Redis',
      enabled: true,
      configuration: {
        host: 'localhost',
        port: 6379,
        ttl: 3600
      },
      usage: { used: 128, total: 512, unit: 'MB' }
    }
  ]);

  const toggleStorage = (id: string) => {
    setStorageConfigs(configs =>
      configs.map(config =>
        config.id === id
          ? { ...config, enabled: !config.enabled }
          : config
      )
    );
  };

  const getStorageIcon = (type: string) => {
    switch (type) {
      case 'database':
        return Database;
      case 'file_storage':
        return Cloud;
      case 'cache':
        return HardDrive;
      default:
        return Database;
    }
  };

  const getStorageColor = (type: string) => {
    switch (type) {
      case 'database':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'file_storage':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'cache':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Storage Configuration</h3>
          <p className="text-gray-400 mt-1">Manage your application's data storage and caching systems</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center shadow-lg hover:shadow-blue-500/25">
          <Plus className="w-4 h-4 mr-2" />
          Add Storage
        </button>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storageConfigs.map((config) => {
          const Icon = getStorageIcon(config.type);
          const colorClass = getStorageColor(config.type);
          const usagePercentage = config.usage ? getUsagePercentage(config.usage.used, config.usage.total) : 0;
          const usageColorClass = getUsageColor(usagePercentage);

          return (
            <div
              key={config.id}
              className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <button
                  onClick={() => toggleStorage(config.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    config.enabled ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <h4 className="text-white font-semibold mb-1">{config.provider}</h4>
              <p className="text-gray-400 text-sm mb-4 capitalize">{config.type.replace('_', ' ')}</p>
              
              {config.usage && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Usage</span>
                    <span className="text-white font-medium">
                      {config.usage.used} / {config.usage.total} {config.usage.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${usageColorClass}`}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{usagePercentage}% used</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Configuration */}
      <div className="space-y-6">
        {storageConfigs.map((config) => {
          const Icon = getStorageIcon(config.type);
          const colorClass = getStorageColor(config.type);
          
          return (
            <div
              key={config.id}
              className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mr-4 ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">{config.provider}</h4>
                      <p className="text-gray-400 text-sm capitalize">{config.type.replace('_', ' ')} Configuration</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      <Activity className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {config.enabled && (
                  <div className="space-y-6 border-t border-gray-800 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(config.configuration).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type={typeof value === 'number' ? 'number' : 'text'}
                            value={value.toString()}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder={`Enter ${key}`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Advanced Settings */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <h5 className="text-white font-medium mb-3">Advanced Settings</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Auto-scaling</span>
                          <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-blue-600 transition-colors">
                            <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-5 transition-transform" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Backup enabled</span>
                          <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-blue-600 transition-colors">
                            <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-5 transition-transform" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Monitoring</span>
                          <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-600 transition-colors">
                            <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center text-sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save Configuration
                        </button>
                        <button className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm">
                          Test Connection
                        </button>
                      </div>
                      <button className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors text-sm">
                        View Metrics
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Storage Recommendations */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
        <h4 className="text-lg font-semibold text-white mb-4">Recommendations</h4>
        <div className="space-y-3">
          <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              <strong>Performance:</strong> Consider enabling Redis caching for frequently accessed data to improve response times.
            </p>
          </div>
          <div className="p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              <strong>Backup:</strong> Schedule regular database backups to prevent data loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageTab;

