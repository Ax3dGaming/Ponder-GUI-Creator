import React from 'react';

export default function PlayerDisplayPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Player Display Settings</span>

      <div className="mt-1 flex flex-col gap-2">
        <label className="text-[10px] text-zinc-400">Target Player</label>
        <div className="text-[9px] text-zinc-500 italic leading-tight">
          Use %player_name% for local player, an explicit UUID, or a Component Placeholder (e.g. {'${'}editBoxId{'}'}).
        </div>
        <input 
          type="text" 
          value={selectedComponent.targetPlayer || ''} 
          onChange={(e) => updateSelectedComponent('targetPlayer', e.target.value)} 
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-emerald-300 outline-none font-mono" 
          placeholder="%player_name%" 
        />
        
        <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-zinc-300 mt-1">
          <input 
            type="checkbox" 
            checked={selectedComponent.isUuid === true} 
            onChange={(e) => updateSelectedComponent('isUuid', e.target.checked)} 
            className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" 
          />
          Target is a UUID
        </label>
      </div>

      <div className="mt-2 border-t border-zinc-800 pt-2 flex flex-col gap-2">
        <div>
          <label className="text-[10px] text-zinc-400">Render Scale</label>
          <input 
            type="number" 
            value={selectedComponent.scale} 
            onChange={(e) => updateSelectedComponent('scale', parseInt(e.target.value, 10) || 1)} 
            className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-white outline-none font-mono mt-1" 
          />
        </div>
      </div>
    </div>
  );
}
