import React, { useState } from 'react';

interface ObservationFormProps {
  hospitalId: string;
}

export default function ObservationForm({ hospitalId }: ObservationFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    observationType: '',
    value: '',
    unit: '',
    date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement observation creation
    console.log('Creating observation:', formData);
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Observation</h2>
      
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
            <label htmlFor="observationType" className="block text-sm font-medium text-gray-700">
              Observation Type *
            </label>
            <select
              name="observationType"
              id="observationType"
              required
              value={formData.observationType}
              onChange={(e) => setFormData({...formData, observationType: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select type</option>
              <option value="vital-signs">Vital Signs</option>
              <option value="laboratory">Laboratory</option>
              <option value="imaging">Imaging</option>
            </select>
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
              Value *
            </label>
            <input
              type="text"
              name="value"
              id="value"
              required
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <input
              type="text"
              name="unit"
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Observation Date *
            </label>
            <input
              type="datetime-local"
              name="date"
              id="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Observation
          </button>
        </div>
      </form>
    </div>
  );
} 