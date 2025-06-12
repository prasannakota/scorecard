import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ModuleListSection() {
  const modules = [
    { id: 1, title: 'Distribution' },
    { id: 2, title: 'Distribution' },
    { id: 3, title: 'Distribution' },
  ];

  return (
    <div className="flex gap-6">
      <div className="w-3/4 bg-white p-6 rounded shadow">
        {/* Section Header */}
        <h2 className="text-xl font-bold mb-6">Complete modules to get accurate score</h2>

        {/* List of Cards */}
        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              {/* Left side: Icon + Text */}
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold">{module.title}</h3>
              </div>

              {/* Right side: Button */}
              <Button variant="outline" className="bg-white text-black rounded-full px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black">
                Start Module
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
