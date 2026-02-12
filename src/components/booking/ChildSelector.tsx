'use client';

import React from 'react';
import { User, Plus } from 'lucide-react';
import { Child } from '@/types/api';

interface ChildSelectorProps {
  childrenMap: Child[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onAddNew: () => void;
}

export function ChildSelector({
  childrenMap,
  selectedIds,
  onChange,
  onAddNew
}: ChildSelectorProps) {

  const toggleChild = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {childrenMap.map((child) => {
          const isSelected = selectedIds.includes(child.id);
          return (
            <button
              key={child.id}
              type="button"
              onClick={() => toggleChild(child.id)}
              className={`relative group flex flex-col items-center p-4 rounded-2xl border-2 transition-all w-28 ${
                isSelected
                  ? 'bg-[#1B3022] border-[#1B3022] text-white'
                  : 'bg-white border-gray-100 hover:border-[#1B3022] hover:bg-gray-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold text-lg ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F2F7F4] text-[#1B3022]'
                }`}
              >
                {child.first_name[0]}
              </div>
              <span className={`text-sm font-medium truncate w-full text-center ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                {child.first_name}
              </span>
              
              {/* Special Needs Badge */}
              {child.profile_type === 'SPECIAL_NEEDS' && (
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isSelected ? 'bg-[#CC7A68]' : 'bg-[#CC7A68]'} ring-2 ring-white`} />
              )}
            </button>
          );
        })}

        {/* Add New Button */}
        <button
          type="button"
          onClick={onAddNew}
          className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#1B3022] hover:bg-[#F2F7F4] transition-all w-28 group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center mb-2 text-gray-400 group-hover:text-[#1B3022] transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-medium text-gray-500 group-hover:text-[#1B3022]">Add New</span>
        </button>
      </div>

      {childrenMap.length === 0 && (
         <p className="text-sm text-gray-500 italic">No profiles found. Add your children to personalize care.</p>
      )}
    </div>
  );
}
