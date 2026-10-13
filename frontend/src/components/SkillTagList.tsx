import React, { useState } from 'react';
import { SkillMatchItem } from '../types';
import { CheckCircle2, AlertCircle, XCircle, Search, Sparkles } from 'lucide-react';

interface SkillTagListProps {
  matchedSkills: SkillMatchItem[];
  partialSkills: SkillMatchItem[];
  missingSkills: SkillMatchItem[];
}

export const SkillTagList: React.FC<SkillTagListProps> = ({
  matchedSkills,
  partialSkills,
  missingSkills,
}) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'partial' | 'missing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SkillMatchItem | null>(null);

  const allSkills = [
    ...matchedSkills,
    ...partialSkills,
    ...missingSkills
  ];

  const filteredSkills = allSkills.filter(item => {
    if (filter === 'matched' && item.status !== 'matched') return false;
    if (filter === 'partial' && item.status !== 'partial') return false;
    if (filter === 'missing' && item.status !== 'missing') return false;
    if (searchQuery && !item.skill.toLowerCase().includes(searchQuery.toLowerCase()) && !item.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Target Skills & Competency Matrix</span>
          </h3>
          <p className="text-xs text-slate-500">
            Compare skills requested in the job description against verified resume evidence.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-full sm:w-48"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Skills ({allSkills.length})
        </button>
        <button
          onClick={() => setFilter('matched')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
            filter === 'matched'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Matched ({matchedSkills.length})</span>
        </button>
        <button
          onClick={() => setFilter('partial')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
            filter === 'partial'
              ? 'bg-amber-500 text-white'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Partially Demonstrated ({partialSkills.length})</span>
        </button>
        <button
          onClick={() => setFilter('missing')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
            filter === 'missing'
              ? 'bg-rose-600 text-white'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Missing ({missingSkills.length})</span>
        </button>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          No skills match your current filter or search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSkills.map((item) => {
            const isMatched = item.status === 'matched';
            const isPartial = item.status === 'partial';

            return (
              <div
                key={item.skill}
                onClick={() => setSelectedSkill(selectedSkill?.skill === item.skill ? null : item)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  isMatched
                    ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60'
                    : isPartial
                    ? 'border-amber-200 bg-amber-50/30 hover:bg-amber-50/60'
                    : 'border-rose-200 bg-rose-50/30 hover:bg-rose-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {isPartial && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                    {!isMatched && !isPartial && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                    <span className="font-bold text-sm text-slate-900">{item.skill}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600">
                    {item.importance}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-medium text-brand-600">
                    {selectedSkill?.skill === item.skill ? 'Hide Evidence' : 'View Evidence'}
                  </span>
                </div>

                {/* Evidence Drawer */}
                {selectedSkill?.skill === item.skill && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 text-xs">
                    {item.resume_evidence ? (
                      <p className="text-slate-700 bg-white p-2 rounded border border-slate-100">
                        <strong className="text-[11px] text-slate-400 block mb-0.5">Resume Evidence:</strong>
                        "{item.resume_evidence}"
                      </p>
                    ) : (
                      <p className="text-rose-700 bg-white p-2 rounded border border-rose-100">
                        <strong className="text-[11px] text-rose-400 block mb-0.5">Gap Finding:</strong>
                        This requirement was not identified in the resume text or known synonym families.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
