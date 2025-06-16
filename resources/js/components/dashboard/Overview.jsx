import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Overview = () => {
  const [activeTab, setActiveTab] = useState(1);


const tabContent = [
  {
    id: 1,
    title: "Overview",
    content: (
     <ul className="leading-relaxed space-y-3">
      {[
        "Custom Assessments: Get a deep dive into your business with evaluations tailored to your unique needs.",
        "SWOT Breakdown: Clear insights into what's working, what's not, and where the biggest opportunities lie.",
        "Growth Benchmarks: See where you stand in the industry and how to level up strategically.",
        "Actionable Roadmap: Practical steps to refine operations, adopt best practices and scale effectively."
      ].map((text, i) => {
        const [title, desc] = text.split(": ");
        return (
          <li key={i} className="flex items-start">
            <svg
              className="flex-shrink-0 mt-1 mr-3 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <p>
              <strong>{title}:</strong> {desc}
            </p>
          </li>
        );
      })}
    </ul>
    ),
  },
  {
    id: 2,
    title: "What It Is ",
    content: (
      <ul>
        <li><strong>Point 1:</strong> This is the normal text for point 1.</li>
      </ul>
    ),
  },
  {
    id: 3,
    title: "What You Get ",
    content: (
      <ul>
        <li><strong>Point 1:</strong> This is the normal text for point 1.</li>
      </ul>
    ),
  },
  {
    id: 4,
    title: "How It Helps ",
    content: (
      <ul>
        <li><strong>Point 1:</strong> This is the normal text for point 1.</li>
      </ul>
    ),
  }
];

return (
  <div className="space-y-4 md:max-w-[1000px] m-auto">
    <div className="flex justify-between ">
      {tabContent.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 text-xl font-medium rounded-none transition-all  border-b-2 border-transparent duration-300 ${
            activeTab === tab.id
              ? "font-bold text-black650  !border-green100"
              : "text-muted-foreground"
          }`}
        >
          {tab.title}
        </Button>
      ))}
    </div>

      <div className="py-8 px-4 text-lg">
        {tabContent.find((tab) => tab.id === activeTab)?.content}
      </div>
  </div>
);

};

export default Overview;
