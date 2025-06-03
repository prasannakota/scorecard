import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ResultBanner() {
  const percentage = 75; // Example score

  return (
        <div className="flex flex-col md:flex-row p-6 gap-6">
          {/* Left Section (75%) */}
          <div className="md:w-3/4 w-full bg-black text-white p-6 shadow-lg">
            <h1 className="text-2xl font-bold mb-2">Your Business is developing it's strengths.</h1>
            <p className="text-white/80 mb-4">
              You're on your way to building a high-performing commerce business. Sales and logistics are strong, but your marketing strategy has room to grow
            </p>
            <p className="italic my-4">
              Last updated on 4 April,2024.
            </p>
            <div className="flex gap-4">
              <Button className="bg-white text-black rounded-full px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black !text-black no-underline hover:no-underline hover:text-black">Continue Assessment</Button>
              <Button variant="outline" className="bg-white text-black rounded-full px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black !text-black no-underline hover:no-underline hover:text-black">Download Results</Button>
            </div>
          </div>

          {/* Right Section (25%) */}
         <div className="md:w-1/4 w-full bg-gray-300 flex flex-col items-center justify-center p-6 shadow-lg">
            <h1 className="font-bold mb-4">Your overall score is</h1>
            <div className="w-36 h-36">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textSize: '16px',
                  textColor: '#000',
                  pathColor: '#4CAF50',
                  trailColor: '#e0e0e0',
                })}
              />
            </div>
          </div>
        </div>
  );
}
