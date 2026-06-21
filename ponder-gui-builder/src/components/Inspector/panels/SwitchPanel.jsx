import React from 'react';

export default function SwitchPanel({ selectedComponent, updateSelectedComponent, loadedAssets = [] }) {
  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Switch Settings</span>

      <div className="flex items-center gap-2 mt-1">
        <input 
          type="checkbox" 
          checked={selectedComponent.defaultState || false} 
          onChange={(e) => updateSelectedComponent('defaultState', e.target.checked)} 
          className="accent-amber-500" 
        />
        <label className="text-xs text-white">Default State (ON)</label>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <div>
            <label className="text-[10px] text-zinc-400">Texture ON (Optional)</label>
            {loadedAssets.length > 0 ? (
                <select
                    value={selectedComponent.textureOn || ''}
                    onChange={(e) => updateSelectedComponent('textureOn', e.target.value)}
                    className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300 mt-1"
                >
                    <option value="">-- Select Texture ON --</option>
                    {loadedAssets.map(asset => (
                        <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
                    ))}
                </select>
            ) : (
                <input 
                    type="text" 
                    value={selectedComponent.textureOn || ''} 
                    onChange={(e) => updateSelectedComponent('textureOn', e.target.value)} 
                    placeholder="modid:textures/gui/switch_on.png"
                    className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-white outline-none font-mono mt-1" 
                />
            )}
        </div>

        <div>
            <label className="text-[10px] text-zinc-400">Texture OFF (Optional)</label>
            {loadedAssets.length > 0 ? (
                <select
                    value={selectedComponent.textureOff || ''}
                    onChange={(e) => updateSelectedComponent('textureOff', e.target.value)}
                    className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300 mt-1"
                >
                    <option value="">-- Select Texture OFF --</option>
                    {loadedAssets.map(asset => (
                        <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
                    ))}
                </select>
            ) : (
                <input 
                    type="text" 
                    value={selectedComponent.textureOff || ''} 
                    onChange={(e) => updateSelectedComponent('textureOff', e.target.value)} 
                    placeholder="modid:textures/gui/switch_off.png"
                    className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-white outline-none font-mono mt-1" 
                />
            )}
        </div>
      </div>
    </div>
  );
}
