import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ArrowLeft } from 'lucide-react';
import ResultBanner from "@/components/result/ResultBanner";
import ProgressSection from "@/components/result/ProgressSection";
import ModuleListSection from "@/components/result/ModuleListSection";
import ModuleBreakdownSection from "@/components/result/ModuleBreakdownSection";
import SummarySection from "@/components/result/SummarySection";
import { useNavigate } from 'react-router-dom';

export default function ResultV1() {
  const percentage = 75;
  const navigate = useNavigate();
  return (
      <div className=" ">
        <div className="bg-gray-100 p-6">
          <header className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              aria-label="Back to Dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold">
              Scorecard Results
            </h1>
          </header>
        </div>

       <div className="bg-white p-6">
            <ResultBanner />
            <ProgressSection percentage={percentage} />
            <ModuleListSection />
            <ModuleBreakdownSection viewMode="list" />
            <SummarySection />
       </div>

      </div>
  );
}
