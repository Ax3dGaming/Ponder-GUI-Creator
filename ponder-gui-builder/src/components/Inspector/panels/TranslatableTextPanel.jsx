import React from 'react';

export default function TranslatableTextPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <div className="flex flex-col gap-1.5">
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
          {selectedComponent.isTranslatable ? 'Translation Key (lang file)' : (selectedComponent.type === 'HoverArea' ? 'Tooltip Text Content' : 'Display Text')}
        </label>
        <input
          type="text"
          value={selectedComponent.text || ''}
          onChange={(e) => updateSelectedComponent('text', e.target.value)}
          className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-sans"
        />
      </div>
    </div>
  );
}
