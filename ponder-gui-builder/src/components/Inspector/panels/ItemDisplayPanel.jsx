import React from 'react';

export default function ItemDisplayPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <label className="text-xs text-zinc-400">Item Registry ID</label>
        <input type="text" value={selectedComponent.item || ''} onChange={(e) => updateSelectedComponent('item', e.target.value)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none font-mono text-emerald-300" placeholder="minecraft:apple" />
      </div>
      <div>
        <label className="text-[10px] text-zinc-400">Scale factor</label>
        <input type="number" step="0.1" value={selectedComponent.itemScale ?? 1.0} onChange={(e) => updateSelectedComponent('itemScale', parseFloat(e.target.value) || 1.0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none font-mono text-white" />
      </div>
      <span className="text-[11px] text-zinc-400 font-bold uppercase mt-1">3D Rotation (Degrees)</span>
      <div className="grid grid-cols-3 gap-1">
        <div>
          <label className="text-[10px] text-zinc-500 block text-center">Axis X</label>
          <input type="number" value={selectedComponent.itemRotationX || 0} onChange={(e) => updateSelectedComponent('itemRotationX', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-white" />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 block text-center">Axis Y</label>
          <input type="number" value={selectedComponent.itemRotationY || 0} onChange={(e) => updateSelectedComponent('itemRotationY', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-white" />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 block text-center">Axis Z</label>
          <input type="number" value={selectedComponent.itemRotationZ || 0} onChange={(e) => updateSelectedComponent('itemRotationZ', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-white" />
        </div>
      </div>
    </div>
  );
}
