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
        <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
                <input type="checkbox" checked={selectedComponent.isUrlOn === true} onChange={(e) => updateSelectedComponent('isUrlOn', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
                <label className="text-[10px] text-zinc-400">Web URL (Texture ON)</label>
            </div>
            {selectedComponent.isUrlOn ? (
                <input 
                    type="text" 
                    value={selectedComponent.textureOn || ''} 
                    onChange={(e) => updateSelectedComponent('textureOn', e.target.value)} 
                    placeholder="https://example.com/switch_on.png"
                    className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs text-sky-300 outline-none font-mono" 
                />
            ) : (
                loadedAssets.length > 0 ? (
                    <select
                        value={selectedComponent.textureOn || ''}
                        onChange={(e) => updateSelectedComponent('textureOn', e.target.value)}
                        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300"
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
                        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-white outline-none font-mono" 
                    />
                )
            )}
        </div>

        <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
                <input type="checkbox" checked={selectedComponent.isUrlOff === true} onChange={(e) => updateSelectedComponent('isUrlOff', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
                <label className="text-[10px] text-zinc-400">Web URL (Texture OFF)</label>
            </div>
            {selectedComponent.isUrlOff ? (
                <input 
                    type="text" 
                    value={selectedComponent.textureOff || ''} 
                    onChange={(e) => updateSelectedComponent('textureOff', e.target.value)} 
                    placeholder="https://example.com/switch_off.png"
                    className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs text-sky-300 outline-none font-mono" 
                />
            ) : (
                loadedAssets.length > 0 ? (
                    <select
                        value={selectedComponent.textureOff || ''}
                        onChange={(e) => updateSelectedComponent('textureOff', e.target.value)}
                        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300"
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
                        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-white outline-none font-mono" 
                    />
                )
            )}
        </div>
      </div>
    </div>
  );
}
