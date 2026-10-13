import React from 'react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  title: string;
  subtitle: string;
  statusLabel: string;
  variant: 'ats' | 'match';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  maxScore = 100,
  title,
  subtitle,
  statusLabel,
  variant
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: '#16a34a', text: 'text-green-700' };
    if (score >= 65) return { stroke: variant === 'ats' ? '#2563eb' : '#4f46e5', text: variant === 'ats' ? 'text-blue-700' : 'text-indigo-700' };
    if (score >= 50) return { stroke: '#d97706', text: 'text-amber-700' };
    return { stroke: '#dc2626', text: 'text-red-700' };
  };

  const colors = getColor();

  return (
    <div className="bg-white border border-gray-200 rounded p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 bg-gray-100 border border-gray-200 rounded ${colors.text}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={radius} stroke="#e5e7eb" strokeWidth="10" fill="transparent" />
            <circle
              cx="65" cy="65" r={radius}
              stroke={colors.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-3xl font-bold ${colors.text}`}>{Math.round(score)}</span>
            <span className="text-xs text-gray-400">/ {maxScore}</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-0.5">Grade</p>
          <p className="text-base font-semibold text-gray-800">
            {score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 50 ? 'Needs Work' : 'Poor'}
          </p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            {variant === 'ats'
              ? 'Based on structure, headers, contact info, and keyword coverage.'
              : 'Based on skill coverage, experience, and semantic similarity.'}
          </p>
        </div>
      </div>
    </div>
  );
};
