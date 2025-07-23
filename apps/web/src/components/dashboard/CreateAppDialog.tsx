import React, { useState } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';

interface CreateAppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (app: {
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'developing';
    category: string;
  }) => void;
}

const CreateAppDialog: React.FC<CreateAppDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'developing' as const,
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const categories = [
    'Productivity',
    'Analytics',
    'E-commerce',
    'Communication',
    'Finance',
    'AI/ML',
    'CRM',
    'Marketing',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit(formData);
    setFormData({ name: '', description: '', status: 'developing', category: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Centering wrapper */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Dialog panel */}
        <div className="relative inline-block w-full max-w-lg p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-700/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Create New Application
              </h3>
              <p className="text-gray-400 text-sm">Build your next SaaS product</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* App Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-0 py-4 text-white bg-transparent border-0 border-b-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg placeholder-transparent peer"
                placeholder="Application Name"
                required
              />
              <label
                htmlFor="name"
                className={`absolute left-0 transition-all duration-300 pointer-events-none ${formData.name || focusedField === 'name'
                  ? '-top-6 text-sm text-blue-400'
                  : 'top-4 text-lg text-gray-400'
                  }`}
              >
                Application Name
              </label>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${focusedField === 'name' ? 'w-full' : 'w-0'
                }`} />
            </div>

            {/* Description */}
            <div className="relative">
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                rows={3}
                className="w-full px-0 py-4 text-white bg-transparent border-0 border-b-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none placeholder-transparent peer"
                placeholder="Description"
                required
              />
              <label
                htmlFor="description"
                className={`absolute left-0 transition-all duration-300 pointer-events-none ${formData.description || focusedField === 'description'
                  ? '-top-6 text-sm text-blue-400'
                  : 'top-4 text-lg text-gray-400'
                  }`}
              >
                Description
              </label>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${focusedField === 'description' ? 'w-full' : 'w-0'
                }`} />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                onFocus={() => setFocusedField('category')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-0 py-4 text-white bg-transparent border-0 border-b-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg appearance-none cursor-pointer peer"
                required
              >
                <option value="" disabled className="bg-gray-800 text-gray-400">
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-800 text-white py-2">
                    {category}
                  </option>
                ))}
              </select>
              <label
                htmlFor="category"
                className={`absolute left-0 transition-all duration-300 pointer-events-none ${formData.category || focusedField === 'category'
                  ? '-top-6 text-sm text-blue-400'
                  : 'top-4 text-lg text-gray-400'
                  }`}
              >
                Category
              </label>
              <ChevronDown className="absolute right-0 top-4 w-6 h-6 text-gray-400 pointer-events-none" />
              <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${focusedField === 'category' ? 'w-full' : 'w-0'
                }`} />
            </div>

            {/* Initial Status */}
            <div className="relative">
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                onFocus={() => setFocusedField('status')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-0 py-4 text-white bg-transparent border-0 border-b-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-colors duration-300 text-lg appearance-none cursor-pointer"
              >
                <option value="developing" className="bg-gray-800 text-white py-2">Developing</option>
                <option value="active" className="bg-gray-800 text-white py-2">Active</option>
                <option value="inactive" className="bg-gray-800 text-white py-2">Inactive</option>
              </select>
              <label
                htmlFor="status"
                className={`absolute left-0 transition-all duration-300 pointer-events-none ${focusedField === 'status'
                  ? '-top-6 text-sm text-blue-400'
                  : 'top-4 text-lg text-gray-400'
                  }`}
              >
                Initial Status
              </label>
              <ChevronDown className="absolute right-0 top-4 w-6 h-6 text-gray-400 pointer-events-none" />
              <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${focusedField === 'status' ? 'w-full' : 'w-0'
                }`} />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end pt-8 space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-300 hover:text-white font-medium rounded-xl hover:bg-gray-800/50 transition-all duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.description.trim() || !formData.category}
                className="inline-flex items-center px-8 py-3 text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAppDialog;

