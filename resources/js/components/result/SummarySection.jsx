import React from 'react';
import { Button } from "@/components/ui/button";

export default function SummarySection() {
  return (
    <div className="w-[75%] my-8 p-6 bg-white shadow-sm rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Key Insights & Recommendations</h2>
      <p className="text-black mb-4">
        Based on your responses so far, we've generated some preliminiary insights. These recommendations will become more tailored as you complete the remoaining modules.
        <br /> Key Observations:
      </p>
      <ul className="list-disc pl-5 text-black mb-6 space-y-2">
        <li>Your Product page conversion rate appears to be below industry avarage</li>
        <li>Mobile checkout completion shows strong performance</li>
        <li>Customer retention strategies may need attenstion</li>
      </ul>
      <p>Next Steps:</p>
      <ul className="list-disc pl-5 text-black mb-6 space-y-2">
        <li>Complete the remaining assessment modules for a comprehensive analysis</li>
        <li>Review your mobile experience success factors for potential application to desktop</li>
        <li>Consider implementing the suggested quick wins while waiting for your final scorecard</li>
      </ul>
      <p className="italic my-4">
        Note: These insights are based on partial data. Complete all modules for the most accurate and comprehensive recommendations.
      </p>
      <Button
        variant="outline"
        className="bg-white text-black border border-black rounded-full px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black !text-black no-underline hover:no-underline hover:text-black"
      >Download Results
      </Button>

    </div>
  );
}
