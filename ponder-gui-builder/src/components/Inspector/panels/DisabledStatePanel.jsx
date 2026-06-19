import React from 'react';

export default function DisabledStatePanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Disabled State</span>
      <div className="mt-1">
        <label className="text-[10px] text-zinc-500">Disable if this component is empty:</label>
        <div className="text-[9px] text-zinc-500 italic mb-1 leading-tight">Enter an EditBox or InputSlot ID (e.g. editbox_1)</div>
        <input 
            type="text" 
            value={selectedComponent.disabledIfEmpty || ''} 
            onChange={(e) => updateSelectedComponent('disabledIfEmpty', e.target.value)} 
            className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none text-red-300 font-mono" 
            placeholder="editbox_1" 
        />
      </div>
    </div>
  );
}
