import React from 'react';

export default function PropertiesInspector({ selectedComponent, updateSelectedComponent, onDelete }) {
  if (!selectedComponent) {
    return (
      <div className="w-64 bg-zinc-800 p-4 border-l border-zinc-700 flex flex-col gap-4 overflow-y-auto">
        <h3 className="text-md font-bold text-zinc-300">Properties</h3>
        <div className="text-xs text-zinc-500 italic">Right click on any component to edit its properties here.</div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-zinc-800 p-4 border-l border-zinc-700 flex flex-col gap-4 overflow-y-auto">
      <h3 className="text-md font-bold text-zinc-300">Properties</h3>
      
      <div className="flex flex-col gap-3">
        <div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono uppercase">{selectedComponent.type}</span>
        </div>
        <div>
          <label className="text-xs text-zinc-400">Unique ID (Java)</label>
          <div className="text-xs text-emerald-400 bg-zinc-900 p-2 rounded mt-1 select-all font-mono">{selectedComponent.id}</div>
        </div>

        {(selectedComponent.type === 'Button' || selectedComponent.type === 'Label') && (
          <div>
            <label className="text-xs text-zinc-400">Display Text</label>
            <input type="text" value={selectedComponent.text} onChange={(e) => updateSelectedComponent('text', e.target.value)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none" />
          </div>
        )}

        {(selectedComponent.type === 'ImageButton' || selectedComponent.type === 'Image') && (
            <div>
                <label className="text-xs text-zinc-400">Texture Asset (Location)</label>
                <input type="text" value={selectedComponent.texture} onChange={(e) => updateSelectedComponent('texture', e.target.value)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono" />
            </div>
        )}

        {selectedComponent.type === 'EditBox' && (
          <div>
            <label className="text-xs text-zinc-400">Hint Text</label>
            <input type="text" value={selectedComponent.placeholder} onChange={(e) => updateSelectedComponent('placeholder', e.target.value)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-zinc-400">X Position</label>
            <input type="number" value={selectedComponent.x} onChange={(e) => updateSelectedComponent('x', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none" />
          </div>
          <div>
            <label className="text-xs text-zinc-400">Y Position</label>
            <input type="number" value={selectedComponent.y} onChange={(e) => updateSelectedComponent('y', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-zinc-400">Width</label>
            <input type="number" value={selectedComponent.width} onChange={(e) => updateSelectedComponent('width', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none" />
          </div>
          <div>
            <label className="text-xs text-zinc-400">Height</label>
            <input type="number" value={selectedComponent.height} onChange={(e) => updateSelectedComponent('height', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none" />
          </div>
        </div>

        {selectedComponent.type === 'Label' && (
          <div>
            <label className="text-xs text-zinc-400">Color (Java Hex)</label>
            <input type="text" value={selectedComponent.color} onChange={(e) => updateSelectedComponent('color', e.target.value)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 text-emerald-300 outline-none font-mono" />
          </div>
        )}

        
        {selectedComponent.type === 'ScrollPanel' && (
          <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase">Scroll Settings</span>
            <div>
              <label className="text-[11px] text-zinc-400">Max Content Size (px)</label>
              <input 
                type="number" 
                value={selectedComponent.maxScrollDistance || 600} 
                onChange={(e) => updateSelectedComponent('maxScrollDistance', parseInt(e.target.value, 10) || 0)} 
                className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-emerald-300" 
              />
            </div>

            <label className="flex items-center gap-2 text-xs cursor-pointer select-none mt-1">
              <input type="checkbox" checked={selectedComponent.scrollX || false} onChange={(e) => updateSelectedComponent('scrollX', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500"/>
              Enable Horizontal Scroll
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input type="checkbox" checked={selectedComponent.scrollY !== false} onChange={(e) => updateSelectedComponent('scrollY', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500"/>
              Enable Vertical Scroll
            </label>
          </div>
        )}

        {selectedComponent.type === 'Slider' && (
          <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase">Slider Settings</span>
    
            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="text-[10px] text-zinc-400">Min</label>
                <input type="number" value={selectedComponent.minVal} onChange={(e) => updateSelectedComponent('minVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400">Max</label>
                <input type="number" value={selectedComponent.maxVal} onChange={(e) => updateSelectedComponent('maxVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400">Default</label>
                <input type="number" value={selectedComponent.currentVal} onChange={(e) => updateSelectedComponent('currentVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300" />
              </div>
            </div>
          </div>
        )}
        
        <button onClick={onDelete} className="w-full bg-red-900/40 border border-red-700 hover:bg-red-800 text-red-200 py-1.5 px-3 rounded text-xs mt-4 transition">
          Delete Component
        </button>
      </div>
    </div>
  );
}