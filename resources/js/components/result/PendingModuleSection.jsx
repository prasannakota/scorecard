import React, { useState } from 'react';
import { CheckCircle, XCircle, Timer } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ModuleBreakdownSection() {
  const [showAll, setShowAll] = useState(false);

  const modules = [
    { title: 'Marketing Strategy', subtitle: 'Focus on digital channels', percentage: 100, status: 'Average' },
    { title: 'Logistics', subtitle: 'Optimize supply chain', percentage: 85, status: 'High' },
    { title: 'Sales Performance', subtitle: 'Increase conversion rates', percentage: 0, status: 'Low' },
    { title: 'Customer Engagement', subtitle: 'Improve retention metrics', percentage: 78, status: 'Average' },
    { title: 'Product Development', subtitle: 'Enhance core offerings', percentage: 92, status: 'High' },
    { title: 'Brand Strategy', subtitle: 'Strengthen brand voice', percentage: 55, status: 'Low' },
    { title: 'Team Efficiency', subtitle: 'Boost collaboration', percentage: 80, status: 'High' },
    { title: 'Financial Planning', subtitle: 'Optimize cash flow', percentage: 60, status: 'Average' },
    { title: 'Risk Management', subtitle: 'Mitigate vulnerabilities', percentage: 40, status: 'Low' },
  ];

  const visibleModules = showAll ? modules : modules.slice(0, 8);

  const getIcon = (percentage) => {
    if (percentage === 100) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (percentage === 0) return <XCircle className="w-6 h-6 text-red-600" />;
    return <Timer className="w-6 h-6 text-yellow-600" />;
  };

  const getButtonLabel = (percentage) => {
    if (percentage > 0 && percentage < 100) return "Continue";
    return "Start module";
  };

  return (
    <div className="mt-12 w-3/4 p-6">
      <h2 className="text-lg font-bold mb-4">Complete 6 Pending Modules</h2>
      <p>Finish all in-progress and unstarted modules to see your accurate overall score.</p>

      <div className="space-y-4">
        {visibleModules.map((mod, i) => (
          <div key={i} className="flex items-center bg-white p-4 rounded shadow border">
            {/* Left: Icon */}
            <div className="flex items-center gap-2">
              {getIcon(mod.percentage)}
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

            {/* Right: Score & Button */}
            <div className="flex flex-col items-center gap-2 w-2/12">
              {/* Show score only if percentage is 0 or 100 */}
              {(mod.percentage != 0) && (
                <p className="text-xs text-gray-500">Score {mod.percentage}%</p>
              )}
              <Button
                variant="outline"
                className="bg-white text-black border border-black rounded-full px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black !text-black no-underline hover:no-underline hover:text-black"
              >
                {getButtonLabel(mod.percentage)}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
