import React from 'react';
import { Users, Zap, Shield } from 'lucide-react';
import type { AppI, AuthProviderI } from '../../type';

interface OverviewTabProps {
  app: AppI;
  authProviders: AuthProviderI[];
  getStatusColor: (status: string) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ app, authProviders, getStatusColor }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            App Information
          </h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Description</label>
              <p className="text-white mt-2 leading-relaxed">{app.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Category</label>
                <p className="text-white mt-2 font-medium">{app.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Status</label>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Created</label>
              <p className="text-white mt-2 font-medium">{new Date(app.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            Analytics Overview
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 mr-4">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Active Users</span>
                  <p className="text-white font-medium">Total registered users</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">{app.users.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30 mr-4">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Integrations</span>
                  <p className="text-white font-medium">Connected services</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">{app.integrations}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30 mr-4">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Auth Providers</span>
                  <p className="text-white font-medium">Authentication methods</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                {authProviders.filter(p => p.enabled).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all text-left group">
            <Shield className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-medium mb-1">Setup Authentication</h4>
            <p className="text-gray-400 text-sm">Configure OAuth providers</p>
          </button>

          <button className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all text-left group">
            <Zap className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-medium mb-1">Add Integrations</h4>
            <p className="text-gray-400 text-sm">Connect external services</p>
          </button>

          <button className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all text-left group">
            <Users className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-white font-medium mb-1">View Analytics</h4>
            <p className="text-gray-400 text-sm">Check user engagement</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

