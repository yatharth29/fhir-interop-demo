import React, { useState } from 'react';

interface ConditionFormProps {
  hospitalId: string;
}

export default function ConditionForm({ hospitalId }: ConditionFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    conditionCode: '',
    severity: '',
    onsetDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating condition:', formData);
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Condition</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
              Patient ID *
            </label>
            <input
              type="text"
              name="patientId"
              id="patientId"
              required
              value={formData.patientId}
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="conditionCode" className="block text-sm font-medium text-gray-700">
              Condition Code *
            </label>
            <input
              type="text"
              name="conditionCode"
              id="conditionCode"
              required
              value={formData.conditionCode}
              onChange={(e) => setFormData({...formData, conditionCode: e.target.value})}
              placeholder="e.g., I10"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
              Severity
            </label>
            <select
              name="severity"
              id="severity"
              value={formData.severity}
              onChange={(e) => setFormData({...formData, severity: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select severity</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <div>
            <label htmlFor="onsetDate" className="block text-sm font-medium text-gray-700">
              Onset Date *
            </label>
            <input
              type="date"
              name="onsetDate"
              id="onsetDate"
              required
              value={formData.onsetDate}
              onChange={(e) => setFormData({...formData, onsetDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Clinical Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Condition
          </button>
        </div>
      </form>
    </div>
  );
} 