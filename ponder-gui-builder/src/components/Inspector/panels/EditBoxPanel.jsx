import React from 'react';

export default function EditBoxPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <>
      <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase">EditBox Actions & Filters</span>

        <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
          <input type="checkbox" checked={selectedComponent.forceNumeric === true} onChange={(e) => updateSelectedComponent('forceNumeric', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
          Force Numeric Input (Numbers only)
        </label>

        <div className="flex flex-col gap-1 mt-1">
          <label className="text-[10px] text-zinc-400">Action Trigger:</label>
          <select
            value={selectedComponent.actionEvent || 'ON_CHANGE'}
            onChange={(e) => updateSelectedComponent('actionEvent', e.target.value)}
            className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-400"
          >
            <option value="ON_CHANGE">On Text Change (Live)</option>
            <option value="ON_ENTER">On Enter Pressed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <label className="text-[10px] text-zinc-400">Action Type:</label>
          <select
            value={selectedComponent.actionType || 'NONE'}
            onChange={(e) => updateSelectedComponent('actionType', e.target.value)}
            className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-400"
          >
            <option value="NONE">None</option>
            <option value="UPDATE_LABEL">Live Update Label</option>
            <option value="PRINT_CONSOLE">Print to Console</option>
          </select>
        </div>

        {selectedComponent.actionType === 'UPDATE_LABEL' && (
          <div>
            <label className="text-[10px] text-zinc-400">Target Label ID:</label>
            <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="label_123456" />
          </div>
        )}
        {selectedComponent.actionType === 'PRINT_CONSOLE' && (
          <div className="text-[10px] text-zinc-500 italic mt-1">
            Will print the EditBox string content to the console based on the trigger.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedComponent.isTranslatable === true}
            onChange={(e) => updateSelectedComponent('isTranslatable', e.target.checked)}
            className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500"
          />
          <label className="text-[11px] text-zinc-400">Use Translation Key</label>
        </div>
        <div>
          <label className="text-xs text-zinc-400">
            {selectedComponent.isTranslatable ? 'Hint Translation Key' : 'Hint / Placeholder Text'}
          </label>
          <input
            type="text"
            value={selectedComponent.placeholder || ''}
            onChange={(e) => updateSelectedComponent('placeholder', e.target.value)}
            className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white"
          />
        </div>
      </div>
    </>
  );
}
