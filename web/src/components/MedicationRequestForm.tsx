import React, { useState } from 'react';
import { createMedicationRequest } from '../lib/api';

interface MedicationRequestFormProps {
  hospitalId: string;
}

export default function MedicationRequestForm({ hospitalId }: MedicationRequestFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    medicationCode: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const [message, setMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const mr = {
        resourceType: 'MedicationRequest',
        status: 'active',
        intent: 'order',
        subject: { reference: formData.patientId },
        medicationCodeableConcept: { coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: formData.medicationCode || '197361' }] },
        dosageInstruction: [{ text: `${formData.dosage} ${formData.frequency.replace('-', ' ')}` }],
        note: formData.notes ? [{ text: formData.notes }] : undefined,
        authoredOn: formData.startDate
      };
      await createMedicationRequest(hospitalId, mr);
      setMessage('Medication request created');
    } catch (err) {
      setMessage('Error creating medication request');
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Medication Request</h2>
      
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
            <label htmlFor="medicationCode" className="block text-sm font-medium text-gray-700">
              Medication Code *
            </label>
            <input
              type="text"
              name="medicationCode"
              id="medicationCode"
              required
              value={formData.medicationCode}
              onChange={(e) => setFormData({...formData, medicationCode: e.target.value})}
              placeholder="e.g., 197361"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
              Dosage *
            </label>
            <input
              type="text"
              name="dosage"
              id="dosage"
              required
              value={formData.dosage}
              onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              placeholder="e.g., 10mg"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Frequency *
            </label>
            <select
              name="frequency"
              id="frequency"
              required
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select frequency</option>
              <option value="once-daily">Once daily</option>
              <option value="twice-daily">Twice daily</option>
              <option value="three-times-daily">Three times daily</option>
              <option value="as-needed">As needed</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Prescriber Notes
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

        {message && (
          <div className={`p-3 rounded ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Medication Request
          </button>
        </div>
      </form>
    </div>
  );
} 