import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
import type { AuthProviderI } from '../../type';

interface AuthenticationTabProps {
  authProviders: AuthProviderI[];
  setAuthProviders: React.Dispatch<React.SetStateAction<AuthProviderI[]>>;
}

const AuthenticationTab: React.FC<AuthenticationTabProps> = ({ authProviders, setAuthProviders }) => {
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  // const [editingProvider, setEditingProvider] = useState<string | null>(null);

  const toggleAuthProvider = (providerId: string) => {
    setAuthProviders(providers =>
      providers.map(provider =>
        provider.id === providerId
          ? { ...provider, enabled: !provider.enabled }
          : provider
      )
    );
  };

  const toggleSecretVisibility = (providerId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const updateProvider = (providerId: string, field: string, value: string) => {
    setAuthProviders(providers =>
      providers.map(provider =>
        provider.id === providerId
          ? { ...provider, [field]: value }
          : provider
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Authentication Providers</h3>
          <p className="text-gray-400 mt-1">Configure OAuth providers for user authentication</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center shadow-lg hover:shadow-blue-500/25">
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </button>
      </div>

      <div className="grid gap-6">
        {authProviders.map((provider) => (
          <div
            key={provider.id}
            className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-sm"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 mr-4">
                    <span className="text-2xl">{provider.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{provider.name}</h4>
                    <p className="text-gray-400 text-sm">OAuth 2.0 Provider</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium ${provider.enabled ? 'text-green-400' : 'text-gray-400'}`}>
                    {provider.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => toggleAuthProvider(provider.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${provider.enabled ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${provider.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>

              {provider.enabled && (
                <div className="space-y-6 border-t border-gray-800 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Client ID
                      </label>
                      <input
                        type="text"
                        value={provider.clientId || ''}
                        onChange={(e) => updateProvider(provider.id, 'clientId', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter client ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Client Secret
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets[provider.id] ? 'text' : 'password'}
                          value={provider.clientSecret || ''}
                          onChange={(e) => updateProvider(provider.id, 'clientSecret', e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Enter client secret"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecretVisibility(provider.id)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                          {showSecrets[provider.id] ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
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
                    <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Available Providers */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
        <h4 className="text-lg font-semibold text-white mb-4">Available Providers</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Twitter', 'LinkedIn', 'Discord', 'Apple'].map((provider) => (
            <button
              key={provider}
              className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all text-center group"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-lg mx-auto mb-2 group-hover:scale-110 transition-transform"></div>
              <span className="text-white text-sm font-medium">{provider}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationTab;

