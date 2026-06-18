import React from 'react';

export default function LabelPanel({ selectedComponent, updateSelectedComponent, getHtmlColor, handleColorPick }) {
  return (
    <div className="mt-1">
      <label className="text-xs text-zinc-400">Color (Java Hex)</label>
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          value={selectedComponent.color || ''}
          onChange={(e) => updateSelectedComponent('color', e.target.value)}
          className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm text-emerald-300 outline-none font-mono"
          placeholder="0xFFFFFF"
        />
        <input
          type="color"
          value={getHtmlColor(selectedComponent.color)}
          onChange={(e) => handleColorPick(e, 'color', selectedComponent.color)}
          className="w-9 h-auto p-0.5 border border-zinc-700 rounded bg-zinc-900 cursor-pointer"
          title="Pick a color"
        />
      </div>
    </div>
  );
}
