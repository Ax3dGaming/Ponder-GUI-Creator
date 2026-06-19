import React from 'react';

export default function EntityPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <div className="flex flex-col gap-2 mt-1">
      <div>
        <label className="text-xs text-zinc-400">Entity Registry ID</label>
        <input type="text" value={selectedComponent.entity || ''} onChange={(e) => updateSelectedComponent('entity', e.target.value)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none font-mono text-red-300" placeholder="minecraft:zombie" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-1 border-t border-zinc-800 pt-2">
        <div>
          <label className="text-[10px] text-zinc-400">Render Scale</label>
          <input type="number" value={selectedComponent.entityScale || 30} onChange={(e) => updateSelectedComponent('entityScale', parseInt(e.target.value, 10) || 30)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none font-mono text-white" />
        </div>
        <div>
          <label className="text-[10px] text-zinc-400">Rotation (Degrees)</label>
          <input type="number" value={selectedComponent.entityRotationY || 0} onChange={(e) => updateSelectedComponent('entityRotationY', parseInt(e.target.value, 10) || 0)} disabled={selectedComponent.entityFollowMouse !== false} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-white disabled:opacity-40" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 mt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={selectedComponent.entityFollowMouse !== false}
            onChange={(e) => updateSelectedComponent('entityFollowMouse', e.target.checked)}
            className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
          />
          <span className="text-xs text-zinc-300 group-hover:text-white transition">Follow Mouse Position</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={selectedComponent.animateRotation || false}
            onChange={(e) => updateSelectedComponent('animateRotation', e.target.checked)}
            className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
          />
          <span className="text-xs text-zinc-300 group-hover:text-white transition">Animate Rotation</span>
        </label>
      </div>
      
      {!selectedComponent.entityFollowMouse && (
        <>
          <span className="text-[11px] text-zinc-400 font-bold uppercase mt-1">Static 3D Rotation</span>
          <div className="grid grid-cols-3 gap-1">
            <div>
              <label className="text-[10px] text-zinc-500 block text-center">Axis X</label>
              <input type="number" value={selectedComponent.entityRotationX || 0} onChange={(e) => updateSelectedComponent('entityRotationX', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-white" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block text-center">Axis Y</label>
              <input type="number" value={selectedComponent.entityRotationY || 0} onChange={(e) => updateSelectedComponent('entityRotationY', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-white" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block text-center">Axis Z</label>
              <input type="number" value={selectedComponent.entityRotationZ || 0} onChange={(e) => updateSelectedComponent('entityRotationZ', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-white" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
