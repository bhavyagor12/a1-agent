"use client";

import type React from "react";
import { useEffect, useState } from "react";

interface RadialProgressProps {
  value: number;
  label: string;
  max?: number;
  size?: number;
  strokeWidth?: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({
  value,
  label,
  max = 100,
  size = 120,
  strokeWidth = 12,
}) => {
  const [progress, setProgress] = useState(0);
  const normalizedValue = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(normalizedValue), 100);
    return () => clearTimeout(timer);
  }, [normalizedValue]);

  return (
    <div className="flex flex-col gap-4 justify-center text-[12px]">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-muted-foreground"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary transition-all duration-1000 ease-in-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-bold">
          {Math.round(progress)}%
        </div>
      </div>
      <h1 className="text-center text-[10px]">{label}</h1>
    </div>
  );
};

export default RadialProgress;
