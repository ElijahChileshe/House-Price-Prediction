import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [bedrooms, setBedrooms] = useState(0);
  const [size, setSize] = useState(0);
  const [propertyType, setPropertyType] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [output, setOutput] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyStatuses, setPropertyStatuses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/metadata')
      .then(res => res.json())
      .then(data => {
        setPropertyTypes(data.property_types);
        setPropertyStatuses(data.property_statuses);
      })
      .catch(err => console.error("Failed to load metadata", err));
  }, []);

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        bedrooms, 
        size, 
        property_type: propertyType, 
        property_status: propertyStatus 
      }),
    });
    const result = await response.text();
    setOutput(result);
  };

  const clearForm = () => {
    setBedrooms(0);
    setSize(0);
    setPropertyType('');
    setPropertyStatus('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-[#0d0c1d] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">House Price Estimator</h1>
      <div className="bg-[#1f1e2e] p-6 rounded-lg w-full max-w-md shadow-xl">
        <div className="mb-4">
          <label className="block text-sm mb-1">Bedrooms</label>
          <input type="number" value={bedrooms} onChange={(e) => setBedrooms(+e.target.value)}
            className="w-full p-2 rounded bg-[#2d2c3c] text-white border border-gray-700" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Size (in m²)</label>
          <input type="number" value={size} onChange={(e) => setSize(+e.target.value)}
            className="w-full p-2 rounded bg-[#2d2c3c] text-white border border-gray-700" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Property Type</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}
            className="w-full p-2 rounded bg-[#2d2c3c] text-white border border-gray-700">
            <option value="">Select</option>
            {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1">Property Status</label>
          <select value={propertyStatus} onChange={(e) => setPropertyStatus(e.target.value)}
            className="w-full p-2 rounded bg-[#2d2c3c] text-white border border-gray-700">
            <option value="">Select</option>
            {propertyStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        <div className="flex justify-between mb-4">
          <button onClick={clearForm}
            className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded">Clear</button>
          <button onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">Submit</button>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">Output</label>
          <textarea value={output} readOnly rows="2"
            className="w-full p-2 rounded bg-[#2d2c3c] text-white border border-gray-700" />
        </div>

        <button className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">Flag</button>
      </div>
    </div>
  );
};

export default App;
