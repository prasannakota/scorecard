import React, { useState } from 'react';

const getStatusBadge = (status) => {
  let bgColor = 'bg-yellow-200 text-yellow-800';
  if (status === 'High') bgColor = 'bg-green-200 text-green-800';
  if (status === 'Low') bgColor = 'bg-red-200 text-red-800';
  return <span className={`px-2 py-1 rounded text-xs font-medium ${bgColor}`}>{status}</span>;
};

const moduleData = [
  { module: 'Module 1', description: 'Understanding the basics', score: '85%', status: 'High' },
  { module: 'Module 2', description: 'Intermediate topics', score: '60%', status: 'Low' },
  { module: 'Module 3', description: 'Advanced concepts', score: '75%', status: 'Medium' },
];

export default function ModuleBreakdownDescription() {
  const [tab, setTab] = useState('all');

  const filteredData = () => {
    if (tab === 'all') return moduleData;
    if (tab === 'strong') return moduleData.filter(d => d.status === 'High');
    if (tab === 'weak') return moduleData.filter(d => d.status === 'Low');
    return [];
  };

  return (
    <div className="w-[75%] mx-0 mt-8 p-6">
      <h2 className="text-xl font-semibold mb-4">Module Breakdown</h2>

      <div className="flex gap-6 mb-4">
        {['all', 'strong', 'weak'].map((key) => (
          <div
            key={key}
            onClick={() => setTab(key)}
            className={`cursor-pointer pb-2 ${
              tab === key ? 'font-semibold border-b-2 border-black' : 'text-gray-500'
            } capitalize`}
          >
            {key === 'all' && 'All'}
            {key === 'strong' && 'Strong Areas'}
            {key === 'weak' && 'Weak Areas'}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-medium text-gray-500 border-b">
              <th className="py-2 pr-4">Module</th>
              <th className="py-2 pr-4">Result Description</th>
              <th className="py-2 pr-4">Score (%)</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData().map((item, idx) => (
              <tr key={idx} 
              className={`border-b last:border-0 ${
                item.status === 'Low' ? 'bg-red-50' : ''
              }`}>
                <td className="py-2 pr-4">{item.module}</td>
                <td className="py-2 pr-4">{item.description}</td>
                <td className="py-2 pr-4">{item.score}</td>
                <td className="py-2 pr-4">{getStatusBadge(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
