import React from 'react';

export default function SlotPanel({ selectedComponent, updateSelectedComponent, loadedAssets }) {
  return (
    <>
      <div className="mt-2">
        <label className="text-xs text-zinc-400">Ghost Icon (Optional)</label>
        
        {loadedAssets.length > 0 ? (
          <select
            value={selectedComponent.ghostIcon || ''}
            onChange={(e) => updateSelectedComponent('ghostIcon', e.target.value)}
            className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300 mt-1"
          >
            <option value="">-- No Ghost Icon --</option>
            {loadedAssets.map(asset => (
              <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={selectedComponent.ghostIcon || ''}
            onChange={(e) => updateSelectedComponent('ghostIcon', e.target.value)}
            className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-zinc-300"
            placeholder="modid:textures/gui/empty_slot.png"
          />
        )}
      </div>
    </>
  );
}
