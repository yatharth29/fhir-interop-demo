import React, { useState, useEffect } from 'react';
import { listPatients, getPatient, deletePatient } from '../lib/api';

interface Patient {
  id: string;
  name?: Array<{
    family?: string;
    given?: string[];
  }>;
  gender?: string;
  birthDate?: string;
  identifier?: Array<{
    value?: string;
  }>;
}

interface PatientTableProps {
  hospitalId: string;
}

export default function PatientTable({ hospitalId }: PatientTableProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
    const handler = () => fetchPatients();
    window.addEventListener('patients:refresh', handler);
    return () => window.removeEventListener('patients:refresh', handler);
  }, [hospitalId]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await listPatients(hospitalId);
      const bundle = response.data;
      const resources = (bundle.entry || []).map((e: any) => e.resource);
      setPatients(resources);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (idOrIdentifier: string) => {
    try {
      // Optimistically try id; if it fails, the gateway still accepts identifier via search in future enhancements
      const res = await getPatient(hospitalId, idOrIdentifier);
      alert(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error('View failed', err);
      setError('Failed to view patient');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this patient?')) return;
    try {
      await deletePatient(hospitalId, id);
      await fetchPatients();
    } catch (err) {
      console.error('Delete failed', err);
      setError('Failed to delete patient');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchPatients}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Patients in {hospitalId}</h2>
        <div className="text-sm text-gray-500">
          Total: {patients.length} patients
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No patients found for this hospital.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Birth Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.identifier?.[0]?.value || patient.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.name?.[0] ? 
                      `${patient.name[0].given?.join(' ') || ''} ${patient.name[0].family || ''}`.trim() : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.birthDate || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleView(patient.id)}>
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-3" onClick={() => alert('Edit not implemented in demo')}>
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(patient.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 