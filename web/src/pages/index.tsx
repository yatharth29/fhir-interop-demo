import React, { useState } from 'react';
import HospitalSwitcher from '../components/HospitalSwitcher';
import PatientForm from '../components/PatientForm';
import ObservationForm from '../components/ObservationForm';
import ConditionForm from '../components/ConditionForm';
import MedicationRequestForm from '../components/MedicationRequestForm';
import PatientTable from '../components/PatientTable';

export default function Home() {
  const [selectedHospital, setSelectedHospital] = useState('HOSP-A');
  const [activeTab, setActiveTab] = useState('patients');

  const hospitals = [
    { id: 'HOSP-A', name: 'General Hospital A' },
    { id: 'HOSP-B', name: 'Community Medical Center B' },
    { id: 'HOSP-C', name: 'Regional Health Center C' },
  ];

  const tabs = [
    { id: 'patients', label: 'Patients', component: PatientTable },
    { id: 'add-patient', label: 'Add Patient', component: PatientForm },
    { id: 'add-observation', label: 'Add Observation', component: ObservationForm },
    { id: 'add-condition', label: 'Add Condition', component: ConditionForm },
    { id: 'add-medication', label: 'Add Medication Request', component: MedicationRequestForm },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || PatientTable;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FHIR Interoperability Demo</h1>
              <p className="mt-1 text-sm text-gray-500">
                Hospital Data Management and Interoperability Platform
              </p>
            </div>
            <HospitalSwitcher
              hospitals={hospitals}
              selectedHospital={selectedHospital}
              onHospitalChange={setSelectedHospital}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Active Component */}
        <div className="bg-white shadow rounded-lg p-6">
          <ActiveComponent hospitalId={selectedHospital} />
        </div>
      </div>
    </div>
  );
} 