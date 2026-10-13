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
    if (score >= 80) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 65) return { stroke: variant === 'ats' ? '#2563eb' : '#4f46e5', text: variant === 'ats' ? 'text-blue-600' : 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    if (score >= 50) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { stroke: '#ef4444', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
  };

  const colors = getColor();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center my-3">
        {/* SVG Circular Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
            {/* Background ring */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Foreground progress ring */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke={colors.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-3xl font-extrabold tracking-tight ${colors.text}`}>
              {Math.round(score)}
            </span>
            <span className="text-[11px] font-medium text-slate-400 -mt-1">/ {maxScore}</span>
          </div>
        </div>

        {/* Gauge Metric Summary */}
        <div className="text-center sm:text-left space-y-1">
          <div className="text-xs text-slate-500 font-medium">Performance Grade</div>
          <div className="text-lg font-bold text-slate-800">
            {score >= 80 ? 'Optimized' : score >= 65 ? 'Competitive' : score >= 50 ? 'Requires Refinement' : 'Action Needed'}
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            {variant === 'ats'
              ? 'Evaluates structure, standard sections, contact details, and ATS parsability.'
              : 'Evaluates required & preferred skills, experience duration, and semantic job alignment.'}
          </p>
        </div>
      </div>
    </div>
  );
};
