import React from 'react';

export default function ConditionPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Render Conditions</span>
      <div className="text-[10px] text-zinc-500 italic mb-1">
        If any conditions are set, the widget will only initialize if all conditions are met.
      </div>

      <label className="flex items-center gap-2 text-[11px] text-zinc-300 cursor-pointer select-none">
        <input 
          type="checkbox" 
          checked={selectedComponent.conditionOp === true} 
          onChange={(e) => updateSelectedComponent('conditionOp', e.target.checked)} 
          className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" 
        />
        Require OP Permission (Level 2+)
      </label>

      <label className="flex items-center gap-2 text-[11px] text-zinc-300 cursor-pointer select-none mt-1">
        <input 
          type="checkbox" 
          checked={selectedComponent.conditionCreative === true} 
          onChange={(e) => updateSelectedComponent('conditionCreative', e.target.checked)} 
          className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" 
        />
        Require Creative Mode
      </label>

      <div className="mt-2 pt-2 border-t border-zinc-800">
        <label className="text-[10px] text-zinc-400">Require Specific Item in Inventory:</label>
        <input 
          type="text" 
          value={selectedComponent.conditionItem || ''} 
          onChange={(e) => updateSelectedComponent('conditionItem', e.target.value)} 
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-amber-300 font-mono mt-1" 
          placeholder="minecraft:diamond (leave empty for none)" 
        />
      </div>
    </div>
  );
}
