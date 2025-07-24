
import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Save, Trash2, X } from 'lucide-react';
import type { AuthProviderI } from '../../type';

interface AuthenticationTabProps {
  appId: string;
  authProviders: AuthProviderI[];
  setAuthProviders: React.Dispatch<React.SetStateAction<AuthProviderI[]>>;
}

const AuthenticationTab: React.FC<AuthenticationTabProps> = ({ appId, authProviders, setAuthProviders }) => {
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProvider, setNewProvider] = useState({
    type: '',
    clientID: '',
    clientSecret: ''
  });
  const [provider, setProvider] = useState({
    id: '',
    clientID: '',
    clientSecret: ''
  });

  const availableProviders = [
    { id: 'google', name: 'Google', icon: '🔵' },
    { id: 'github', name: 'GitHub', icon: '⚫' }
  ];

  const toggleAuthProvider = async (providerId: string) => {
    // TODO: Backend API call to toggle provider enabled/disabled status
    // API: PUT /api/v1/saasconfig/toggleProvider
    // Body: { appId, providerId, enabled: !currentStatus }
    // On success: refetch authProviders or update state with response
    console.log('Toggle provider:', providerId);
  };

  const toggleSecretVisibility = (providerId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const updateProvider = async (providerId: string, field: string, value: string) => {
    // TODO: Backend API call to update provider configuration
    // API: PUT /api/v1/saasconfig/updateProvider
    // Body: { appId, providerId, field, value }
    // Should update clientID or clientSecret in database
    // On success: refetch authProviders or update state with response
    console.log('Update provider:', providerId, field, value);
  };

  const handleAddProvider = async () => {
    if (!newProvider.type || !newProvider.clientID || !newProvider.clientSecret) {
      return;
    }

    try {
      const authToken = localStorage.getItem("token-infrax-appuser");
      const response = await fetch("http://localhost:3001/api/v1/saasconfig/addProvider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id: appId,
          provider: {
            appId: newProvider.clientID,
            secretKey: newProvider.clientSecret,
            type: newProvider.type
          }
        })
      });

      const status = response.status;
      const data = await response.json();

      if (status === 200) {
        // TODO: On successful addition, refetch authProviders from backend
        // or update setAuthProviders with the new provider from response
        // setAuthProviders(data.providers) or refetch all providers
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }

    setNewProvider({ type: '', clientID: '', clientSecret: '' });
    setIsAddDialogOpen(false);
  };

  const removeProvider = async (providerId: string) => {
    // TODO: Backend API call to remove provider
    // API: DELETE /api/v1/saasconfig/removeProvider
    // Body/Params: { appId, providerId }
    // On success: refetch authProviders or remove from state
    console.log('Remove provider:', providerId);
  };

  const handleSaveConfiguration = async (providerId: string) => {
    // TODO: Backend API call to save/update provider configuration
    // API: PUT /api/v1/saasconfig/saveProviderConfig
    // Body: { appId, providerId, clientID, clientSecret }
    // Should validate and save the current form values to database
    console.log('Save configuration for provider:', providerId);
  };

  const handleTestConnection = async (providerId: string) => {
    // TODO: Backend API call to test OAuth provider connection
    // API: POST /api/v1/saasconfig/testProvider
    // Body: { appId, providerId }
    // Should attempt OAuth flow validation with current credentials
    // Return success/failure status and any error messages
    console.log('Test connection for provider:', providerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Authentication Providers</h3>
          <p className="text-gray-400 mt-1">Configure OAuth providers for user authentication</p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center shadow-lg hover:shadow-blue-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </button>
      </div>

      {/* Existing Providers */}
      <div className="grid gap-6">
        {authProviders.map((provider, index) => (
          <div
            key={index}
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
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${provider.enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${provider.enabled ? 'translate-x-6' : 'translate-x-1'}`}
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
                        value={provider.clientID || ''}
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
                      <button 
                        onClick={() => handleSaveConfiguration(provider.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center text-sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Configuration
                      </button>
                      <button 
                        onClick={() => handleTestConnection(provider.id)}
                        className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
                      >
                        Test Connection
                      </button>
                    </div>
                    <button
                      onClick={() => removeProvider(provider.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {authProviders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
            <Plus className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No authentication providers</h3>
          <p className="text-gray-400 mb-6">Add your first OAuth provider to enable user authentication</p>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </button>
        </div>
      )}

      {/* Add Provider Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setIsAddDialogOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Add Authentication Provider</h3>
                  <p className="text-gray-400 text-sm mt-1">Configure a new OAuth provider</p>
                </div>
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Provider Type
                  </label>
                  <select
                    value={newProvider.type}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a provider</option>
                    {availableProviders
                      .filter(provider => !authProviders.some(existing => existing.id === provider.id))
                      .map((provider) => (
                        <option key={provider.id} value={provider.id} className="bg-gray-800">
                          {provider.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={newProvider.clientID}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, clientID: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter client ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={newProvider.clientSecret}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, clientSecret: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter client secret"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsAddDialogOpen(false)}
                    className="px-6 py-3 text-gray-300 hover:text-white font-medium rounded-xl hover:bg-gray-800/50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProvider}
                    disabled={!newProvider.type || !newProvider.clientID || !newProvider.clientSecret}
                    className="px-6 py-3 text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                  >
                    Add Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticationTab;

