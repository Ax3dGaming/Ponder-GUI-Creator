import React from 'react';

export default function ProgressBarPanel({ selectedComponent, updateSelectedComponent, loadedAssets, getHtmlColor, handleColorPick }) {
  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Progress Bar Settings</span>

      <div className="mt-1 flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
          <input type="checkbox" checked={selectedComponent.useCustomTextures === true} onChange={(e) => updateSelectedComponent('useCustomTextures', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
          Enable Custom Textures
        </label>

        {!selectedComponent.useCustomTextures ? (
          <>
            <div>
              <label className="text-[10px] text-zinc-400">Fill Color (Java Hex)</label>
              <div className="flex gap-2 mt-1">
                <input type="text" value={selectedComponent.color} onChange={(e) => updateSelectedComponent('color', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-emerald-300 outline-none font-mono" placeholder="0xFF10B981" />
                <input type="color" value={getHtmlColor(selectedComponent.color)} onChange={(e) => handleColorPick(e, 'color', selectedComponent.color)} className="w-9 h-auto p-0.5 border border-zinc-700 rounded bg-zinc-950 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-400">Background Color (Java Hex)</label>
              <div className="flex gap-2 mt-1">
                <input type="text" value={selectedComponent.bgColor} onChange={(e) => updateSelectedComponent('bgColor', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs text-zinc-400 outline-none font-mono" placeholder="0xFF3F3F46" />
                <input type="color" value={getHtmlColor(selectedComponent.bgColor)} onChange={(e) => handleColorPick(e, 'bgColor', selectedComponent.bgColor)} className="w-9 h-auto p-0.5 border border-zinc-700 rounded bg-zinc-950 cursor-pointer" />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800 flex flex-col gap-1.5 mt-1">
            <label className="text-[10px] text-zinc-400">Background Texture:</label>
            {loadedAssets.length > 0 ? (
              <select value={selectedComponent.bgTexture || ''} onChange={(e) => updateSelectedComponent('bgTexture', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-amber-400">
                <option value="">-- Choose Asset --</option>
                {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
              </select>
            ) : (
              <input type="text" value={selectedComponent.bgTexture || ""} onChange={(e) => updateSelectedComponent('bgTexture', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-800 text-[10px] font-mono outline-none text-amber-400" placeholder="modid:textures/gui/pb_bg.png" />
            )}

            <label className="text-[10px] text-zinc-400">Fill (Progress) Texture:</label>
            {loadedAssets.length > 0 ? (
              <select value={selectedComponent.fillTexture || ''} onChange={(e) => updateSelectedComponent('fillTexture', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-amber-400">
                <option value="">-- Choose Asset --</option>
                {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
              </select>
            ) : (
              <input type="text" value={selectedComponent.fillTexture || ""} onChange={(e) => updateSelectedComponent('fillTexture', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-800 text-[10px] font-mono outline-none text-amber-400" placeholder="modid:textures/gui/pb_fill.png" />
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1 mt-2 border-t border-zinc-800 pt-2">
        <div>
          <label className="text-[10px] text-zinc-400">Min</label>
          <input type="text" value={selectedComponent.minVal} onChange={(e) => updateSelectedComponent('minVal', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-white" />
        </div>
        <div>
          <label className="text-[10px] text-zinc-400">Max</label>
          <input type="text" value={selectedComponent.maxVal} onChange={(e) => updateSelectedComponent('maxVal', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-white" />
        </div>
      </div>

      <div className="mt-1">
        <label className="text-[10px] text-zinc-400">Fill Direction</label>
        <select 
          value={selectedComponent.fillDirection || 'LTR'} 
          onChange={(e) => updateSelectedComponent('fillDirection', e.target.value)}
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white mt-1"
        >
          <option value="LTR">Left to Right</option>
          <option value="RTL">Right to Left</option>
          <option value="TTB">Top to Bottom</option>
          <option value="BTT">Bottom to Top</option>
        </select>
      </div>

      <div className="mt-1">
        <label className="text-[10px] text-zinc-400">Value (supports Placeholders)</label>
        <input type="text" value={selectedComponent.currentVal} onChange={(e) => updateSelectedComponent('currentVal', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300" />
      </div>
    </div>
  );
}
