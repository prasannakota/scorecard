import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Timer, XCircle } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";

// ProgressSection.jsx

export default function ProgressSection({ percentage = 75, hideRightColumn = false }) {
  return (
    <div className="flex gap-6 bg-white p-6">
      {/* Left column */}
      <div 
        className={`w-3/4 p-6 shadow ${
          hideRightColumn
            ? 'bg-white border border-gray-300 rounded-lg'
            : 'bg-gray-300 rounded'
        }`}
      >
        {/* Header + Badge Row */}
        <div className="flex items-center justify-between text-black p-4 rounded mb-6">
          <h2 className="text-xl font-bold">Your Scorecard Progress</h2>
          <div className="inline-block bg-gray-200 text-black p-4 rounded-full font-semibold">
            84% completed
          </div>
        </div>

        {/* Horizontal progress bar */}
        <div className="w-full h-6 mb-8 rounded-md bg-gray-200 overflow-hidden">
          <div
            className="h-6 bg-orange-500 rounded-md transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Row with three columns */}
        <div className="flex justify-between text-center text-gray-700">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span>2 Completed</span>
          </div>

          <div className="flex items-center gap-1">
            <Timer className="w-6 h-6 text-yellow-600" />
            <span>3 in progress</span>
          </div>

          <div className="flex items-center gap-1">
            <XCircle className="w-6 h-6 text-red-600" />
            <span>4 Yet to start</span>
          </div>
        </div>
      </div>

      {/* Right column */}
      {!hideRightColumn && (
        <div className="w-1/4 bg-gray-300 p-6 rounded shadow flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-3">Book a discovery session</h2>
          <p className="text-gray-600 mb-6">
            Book a free 1-1 discovery session where we will take a deep dive into your results and
            produce an action plan to implement into your business.
          </p>
          <Button
            variant="outline"
            className="w-full bg-white text-black rounded-full px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black"
          >
            Book a Session
          </Button>
        </div>
      )}
    </div>
  );
}
