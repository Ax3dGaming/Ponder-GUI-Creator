import React from 'react';

export default function LayoutPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 mt-2 border-t border-zinc-700 pt-3">
        <div>
          <label className="text-xs text-zinc-400">X Position</label>
          <input type="number" value={selectedComponent.x ?? 0} onChange={(e) => updateSelectedComponent('x', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-mono" />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Y Position</label>
          <input type="number" value={selectedComponent.y ?? 0} onChange={(e) => updateSelectedComponent('y', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <div>
          <label className="text-xs text-zinc-400">Width (Largeur)</label>
          <input type="number" value={selectedComponent.width ?? 0} disabled={['PlayerInventory', 'ItemDisplay', 'InputSlot', 'OutputSlot'].includes(selectedComponent.type)} onChange={(e) => updateSelectedComponent('width', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none disabled:opacity-40 text-white font-mono" />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Height (Hauteur)</label>
          <input type="number" value={selectedComponent.height ?? 0} disabled={['PlayerInventory', 'ItemDisplay', 'InputSlot', 'OutputSlot'].includes(selectedComponent.type)} onChange={(e) => updateSelectedComponent('height', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none disabled:opacity-40 text-white font-mono" />
        </div>
      </div>
    </>
  );
}
