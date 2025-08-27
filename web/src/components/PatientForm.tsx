import React, { useState } from 'react';
import { createPatient } from '../lib/api';

interface PatientFormProps {
  hospitalId: string;
}

export default function PatientForm({ hospitalId }: PatientFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    identifier: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const patientData = {
        resourceType: 'Patient',
        identifier: [
          {
            system: 'http://hospital-system/patient',
            value: formData.identifier
          }
        ],
        name: [
          {
            use: 'official',
            family: formData.lastName,
            given: [formData.firstName]
          }
        ],
        gender: formData.gender,
        birthDate: formData.birthDate
      };

      await createPatient(patientData, hospitalId);
      setMessage('Patient created successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        identifier: ''
      });
    } catch (error) {
      setMessage('Error creating patient. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Patient</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Birth Date *
            </label>
            <input
              type="date"
              name="birthDate"
              id="birthDate"
              required
              value={formData.birthDate}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender *
            </label>
            <select
              name="gender"
              id="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Patient Identifier *
            </label>
            <input
              type="text"
              name="identifier"
              id="identifier"
              required
              value={formData.identifier}
              onChange={handleChange}
              placeholder="e.g., PAT-001"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  );
} 