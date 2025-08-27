import React from 'react';

interface Hospital {
  id: string;
  name: string;
}

interface HospitalSwitcherProps {
  hospitals: Hospital[];
  selectedHospital: string;
  onHospitalChange: (hospitalId: string) => void;
}

export default function HospitalSwitcher({ hospitals, selectedHospital, onHospitalChange }: HospitalSwitcherProps) {
  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="hospital-select" className="text-sm font-medium text-gray-700">
        Select Hospital:
      </label>
      <select
        id="hospital-select"
        value={selectedHospital}
        onChange={(e) => onHospitalChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {hospitals.map((hospital) => (
          <option key={hospital.id} value={hospital.id}>
            {hospital.name}
          </option>
        ))}
      </select>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        <span className="text-sm text-gray-600">Connected</span>
      </div>
    </div>
  );
} 