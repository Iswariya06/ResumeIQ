import React, { useState } from 'react';
import { SkillMatchItem } from '../types';
import { CheckCircle2, AlertCircle, XCircle, Search } from 'lucide-react';

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

  const allSkills = [...matchedSkills, ...partialSkills, ...missingSkills];

  const filteredSkills = allSkills.filter(item => {
    if (filter === 'matched' && item.status !== 'matched') return false;
    if (filter === 'partial' && item.status !== 'partial') return false;
    if (filter === 'missing' && item.status !== 'missing') return false;
    if (searchQuery && !item.skill.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-white border border-gray-200 rounded p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Skills Matrix</h3>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-44"
          />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded text-xs font-medium border ${
            filter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          All ({allSkills.length})
        </button>
        <button
          onClick={() => setFilter('matched')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border ${
            filter === 'matched' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Matched ({matchedSkills.length})
        </button>
        <button
          onClick={() => setFilter('partial')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border ${
            filter === 'partial' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Partial ({partialSkills.length})
        </button>
        <button
          onClick={() => setFilter('missing')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium border ${
            filter === 'missing' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Missing ({missingSkills.length})
        </button>
      </div>

      {filteredSkills.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No skills match your filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredSkills.map((item) => {
            const isMatched = item.status === 'matched';
            const isPartial = item.status === 'partial';

            return (
              <div
                key={item.skill}
                onClick={() => setSelectedSkill(selectedSkill?.skill === item.skill ? null : item)}
                className={`p-3 rounded border cursor-pointer ${
                  isMatched ? 'border-green-200 bg-green-50 hover:bg-green-100' :
                  isPartial ? 'border-amber-200 bg-amber-50 hover:bg-amber-100' :
                  'border-red-200 bg-red-50 hover:bg-red-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {isMatched && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                    {isPartial && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                    {!isMatched && !isPartial && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    <span className="font-medium text-sm text-gray-800">{item.skill}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
                    {item.importance}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{item.category}</p>

                {selectedSkill?.skill === item.skill && (
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                    {item.resume_evidence ? (
                      <p className="text-gray-700 bg-white p-2 rounded border border-gray-100">
                        <span className="block text-[10px] text-gray-400 mb-0.5">Evidence from resume:</span>
                        "{item.resume_evidence}"
                      </p>
                    ) : (
                      <p className="text-red-700 bg-white p-2 rounded border border-red-100">
                        Not found in resume.
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
