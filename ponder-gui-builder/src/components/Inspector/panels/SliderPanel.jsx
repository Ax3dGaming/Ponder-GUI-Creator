import React from 'react';

export default function SliderPanel({ selectedComponent, updateSelectedComponent, loadedAssets }) {
  return (
    <div className="flex flex-col gap-4">
      {/* SLIDER ACTION */}
      <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase">Slider Action</span>
        <select
          value={selectedComponent.actionType || 'NONE'}
          onChange={(e) => updateSelectedComponent('actionType', e.target.value)}
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-400"
        >
          <option value="NONE">None</option>
          <option value="UPDATE_TARGET_SCALE">Live Target Scaling</option>
          <option value="UPDATE_TARGET_ROTATION">Live Target Rotation (Y Axis)</option>
          <option value="UPDATE_PROGRESS_BAR">Update Progress Bar</option>
        </select>

        {['UPDATE_TARGET_SCALE', 'UPDATE_TARGET_ROTATION', 'UPDATE_PROGRESS_BAR'].includes(selectedComponent.actionType) && (
          <div>
            <label className="text-[10px] text-zinc-400">Target Component ID:</label>
            <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="entity_123 or progressbar_456" />
          </div>
        )}
      </div>

      {/* SLIDER SETTINGS */}
      <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase">Slider Settings</span>
        
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
              {selectedComponent.isTranslatable ? 'Slider Translation Key' : 'Slider Display Title'}
            </label>
            <input 
              type="text" 
              value={selectedComponent.text || "Slider"} 
              onChange={(e) => updateSelectedComponent('text', e.target.value)} 
              className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none font-sans text-white" 
            />
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={selectedComponent.isTextPrefix !== false} 
              onChange={(e) => updateSelectedComponent('isTextPrefix', e.target.checked)} 
              className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" 
            />
            Text acts as a Prefix (Append value)
          </label>
        </div>

        {selectedComponent.isTextPrefix !== false && (
          <div className="mt-1">
            <label className="text-xs text-zinc-400">Value Float Precision</label>
            <select 
              value={selectedComponent.formatNumber || 'x'} 
              onChange={(e) => updateSelectedComponent('formatNumber', e.target.value)} 
              className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-emerald-400" 
            >
              <option value="x">x (Integer: 10)</option>
              <option value="x.x">x.x (1 Decimal: 10.5)</option>
              <option value="x.xx">x.xx (2 Decimals: 10.55)</option>
              <option value="x.xxx">x.xxx (3 Decimals: 10.555)</option>
            </select>
          </div>
        )}

        <div className="mt-1 border-t border-zinc-800 pt-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input type="checkbox" checked={selectedComponent.useCustomTextures === true} onChange={(e) => updateSelectedComponent('useCustomTextures', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
            Enable Custom Textures
          </label>

          {selectedComponent.useCustomTextures === true && (
            <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800 flex flex-col gap-1.5 mt-1">
              <label className="text-[10px] text-zinc-400">Track (Bar BG) Texture:</label>
              {loadedAssets.length > 0 ? (
                <select value={selectedComponent.sliderTrackTex || ''} onChange={(e) => updateSelectedComponent('sliderTrackTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-amber-400">
                  <option value="">-- Choose Asset --</option>
                  {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
                </select>
              ) : (
                <input type="text" value={selectedComponent.sliderTrackTex || ""} onChange={(e) => updateSelectedComponent('sliderTrackTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-800 text-[10px] font-mono outline-none text-amber-400" placeholder="modid:textures/gui/slider_track.png" />
              )}

              <label className="text-[10px] text-zinc-400">Thumb (Puce) Texture:</label>
              {loadedAssets.length > 0 ? (
                <select value={selectedComponent.sliderThumbTex || ''} onChange={(e) => updateSelectedComponent('sliderThumbTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-amber-400">
                  <option value="">-- Choose Asset --</option>
                  {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
                </select>
              ) : (
                <input type="text" value={selectedComponent.sliderThumbTex || ""} onChange={(e) => updateSelectedComponent('sliderThumbTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-800 text-[10px] font-mono outline-none text-amber-400" placeholder="modid:textures/gui/slider_thumb.png" />
              )}

              <label className="text-[10px] text-zinc-400">Thumb Width (px):</label>
              <input type="number" value={selectedComponent.sliderThumbWidth || 8} onChange={(e) => updateSelectedComponent('sliderThumbWidth', parseInt(e.target.value, 10) || 8)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] font-mono outline-none text-white text-center" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 mt-2 border-t border-zinc-800 pt-2">
          <div>
            <label className="text-[10px] text-zinc-400">Min</label>
            <input type="number" step="0.1" value={selectedComponent.minVal} onChange={(e) => updateSelectedComponent('minVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-white" />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400">Max</label>
            <input type="number" step="0.1" value={selectedComponent.maxVal} onChange={(e) => updateSelectedComponent('maxVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-white" />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400">Default</label>
            <input type="number" step="0.1" value={selectedComponent.currentVal} onChange={(e) => updateSelectedComponent('currentVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
