import React from 'react';

export default function DropdownPanel({ selectedComponent, updateSelectedComponent, loadedAssets = [] }) {
  const optionsString = (selectedComponent.options || []).join('\n');

  const handleChange = (e) => {
    const lines = e.target.value.split('\n');
    updateSelectedComponent('options', lines);
  };

  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Dropdown Settings</span>

      <div className="mt-1 flex flex-col gap-2">
        <label className="text-[10px] text-zinc-400">Options (One per line)</label>
        <textarea 
          value={optionsString} 
          onChange={handleChange} 
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-amber-300 outline-none font-mono h-24 resize-y" 
          placeholder="Option 1\nOption 2\nOption 3" 
        />
        
        <div>
            <label className="text-[10px] text-zinc-400">Selected Index (Default)</label>
            <input 
                type="number" 
                value={selectedComponent.selectedIndex || 0} 
                onChange={(e) => updateSelectedComponent('selectedIndex', Math.max(0, parseInt(e.target.value, 10) || 0))} 
                className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-white outline-none font-mono mt-1" 
            />
        </div>

        <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
                <input type="checkbox" checked={selectedComponent.isUrlButton === true} onChange={(e) => updateSelectedComponent('isUrlButton', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
                <label className="text-[10px] text-zinc-400">Web URL (Button Texture)</label>
            </div>
            {selectedComponent.isUrlButton ? (
                <input 
                    type="text" 
                    value={selectedComponent.buttonTexture || ''} 
                    onChange={(e) => updateSelectedComponent('buttonTexture', e.target.value)} 
                    placeholder="https://example.com/dropdown_btn.png"
                    className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs text-sky-300 outline-none font-mono" 
                />
            ) : (
                loadedAssets.length > 0 ? (
                    <select
                        value={selectedComponent.buttonTexture || ''}
                        onChange={(e) => updateSelectedComponent('buttonTexture', e.target.value)}
                        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300"
                    >
                        <option value="">-- Select Button Texture --</option>
                        {loadedAssets.map(asset => (
                            <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
                        ))}
                    </select>
                ) : (
                    <input 
                        type="text" 
                        value={selectedComponent.buttonTexture || ''} 
                        onChange={(e) => updateSelectedComponent('buttonTexture', e.target.value)} 
                        placeholder="modid:textures/gui/dropdown_btn.png"
                        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-white outline-none font-mono" 
                    />
                )
            )}
        </div>

        <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
                <input type="checkbox" checked={selectedComponent.isUrlList === true} onChange={(e) => updateSelectedComponent('isUrlList', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
                <label className="text-[10px] text-zinc-400">Web URL (List Texture)</label>
            </div>
            {selectedComponent.isUrlList ? (
                <input 
                    type="text" 
                    value={selectedComponent.listTexture || ''} 
                    onChange={(e) => updateSelectedComponent('listTexture', e.target.value)} 
                    placeholder="https://example.com/dropdown_list.png"
                    className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs text-sky-300 outline-none font-mono" 
                />
            ) : (
                loadedAssets.length > 0 ? (
                    <select
                        value={selectedComponent.listTexture || ''}
                        onChange={(e) => updateSelectedComponent('listTexture', e.target.value)}
                        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300"
                    >
                        <option value="">-- Select List Texture --</option>
                        {loadedAssets.map(asset => (
                            <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
                        ))}
                    </select>
                ) : (
                    <input 
                        type="text" 
                        value={selectedComponent.listTexture || ''} 
                        onChange={(e) => updateSelectedComponent('listTexture', e.target.value)} 
                        placeholder="modid:textures/gui/dropdown_list.png"
                        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-white outline-none font-mono" 
                    />
                )
            )}
        </div>
      </div>
    </div>
  );
}
