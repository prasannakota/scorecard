import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ModuleBreakdownSection({ viewMode = 'list' }) {
  const [showAll, setShowAll] = useState(false);

  const modules = [
    { title: 'Marketing Strategy', subtitle: 'Focus on digital channels', percentage: 67, status: 'Average' },
    { title: 'Logistics', subtitle: 'Optimize supply chain', percentage: 85, status: 'High' },
    { title: 'Sales Performance', subtitle: 'Increase conversion rates', percentage: 45, status: 'Low' },
    { title: 'Customer Engagement', subtitle: 'Improve retention metrics', percentage: 78, status: 'Average' },
    { title: 'Product Development', subtitle: 'Enhance core offerings', percentage: 92, status: 'High' },
    { title: 'Brand Strategy', subtitle: 'Strengthen brand voice', percentage: 55, status: 'Low' },
    { title: 'Team Efficiency', subtitle: 'Boost collaboration', percentage: 80, status: 'High' },
    { title: 'Financial Planning', subtitle: 'Optimize cash flow', percentage: 60, status: 'Average' },
    { title: 'Risk Management', subtitle: 'Mitigate vulnerabilities', percentage: 40, status: 'Low' },
  ];

  const visibleModules = showAll ? modules : modules.slice(0, 8);

  const getStatusBadge = (status) => {
    let bgColor = 'bg-yellow-200 text-yellow-800';
    if (status === 'High') bgColor = 'bg-green-200 text-green-800';
    if (status === 'Low') bgColor = 'bg-red-200 text-red-800';
    return <span className={`px-2 py-1 rounded text-xs font-medium ${bgColor}`}>{status}</span>;
  };

  return (
    <div className="mt-12 w-3/4 p-6">
      <h2 className="text-lg font-bold mb-4">Module Break down</h2>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {visibleModules.map((mod, i) => (
            <div key={i} className="flex items-center bg-white p-4 rounded shadow border">
              {/* Left: Check icon */}
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600 rounded-full border border-green-600" />
              </div>

              {/* Middle: Text + Progress */}
              <div className="flex-1 ml-4">
                <h3 className="text-base font-semibold">{mod.title}</h3>
                <p className="text-sm text-gray-600">{mod.subtitle}</p>

                {/* Horizontal Progress */}
                <div className="w-52 h-2 bg-gray-200 rounded-full my-1 overflow-hidden">
                  <div
                    className="bg-green-700 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${mod.percentage}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500">{mod.percentage}% complete</p>
              </div>

              {/* Right: Score */}
              <div className="flex flex-col items-center gap-2 w-2/12">
                <p className="text-xs text-gray-500">Your Score</p>
                <p className="text-2xl font-bold">{mod.percentage}%</p>
                {getStatusBadge(mod.status)}
              </div>
            </div>

          ))}
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleModules.map((mod, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded shadow border flex flex-col items-center justify-center text-center"
            >
              <h3 className="text-base font-semibold mb-1">{mod.title}</h3>
              <p className="text-sm text-gray-600 mb-2">Score</p>
              <p className="text-3xl font-bold mb-2">{mod.percentage}%</p>
              {getStatusBadge(mod.status)}
            </div>
          ))}
        </div>
      )}

      {/* Separator */}
      <div className="my-6 border-t border-gray-300"></div>

      {/* View All Button */}
      {modules.length > 8 && !showAll && (
        <Button onClick={() => setShowAll(true)} className="bg-black text-white rounded px-6 py-2">
          View All
        </Button>
      )}
    </div>
  );
}
