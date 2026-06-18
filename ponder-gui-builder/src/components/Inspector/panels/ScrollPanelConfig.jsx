import React from 'react';
import { generateScrollPanelWidgetCode } from '../../../utils/scrollPanelGenerator';

export default function ScrollPanelConfig({ selectedComponent, updateSelectedComponent, loadedAssets, guiConfig, getHtmlColor, handleColorPick }) {
  return (
    <div className="flex flex-col gap-3 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Scroll Container Settings</span>

      <button
        type="button"
        onClick={() => {
          const pkg = selectedComponent.widgetPackage || `com.${guiConfig.modId}.client.gui.components`;
          const widgetCode = generateScrollPanelWidgetCode(pkg);
          const blob = new Blob([widgetCode], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ScrollPanelWidget.java';
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-2 rounded text-xs transition text-center shadow"
      >
        📥 Download ScrollPanelWidget.java
      </button>

      <div className="mt-1">
        <label className="w-full text-[11px] text-zinc-400">Widget Package Path</label>
        <input type="text" value={selectedComponent.widgetPackage || `com.${guiConfig.modId}.client.gui.components`} onChange={(e) => updateSelectedComponent('widgetPackage', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-amber-400" />
      </div>

      <div>
        <label className="text-[11px] text-zinc-400">Max Content Dynamic Length (px)</label>
        <input type="number" value={selectedComponent.maxScrollDistance || 600} onChange={(e) => updateSelectedComponent('maxScrollDistance', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-emerald-300" />
      </div>

      <div>
        <label className="text-[11px] text-zinc-400">Scroll Orientation</label>
        <select
          value={selectedComponent.scrollX === true ? 'HORIZONTAL' : 'VERTICAL'}
          onChange={(e) => {
            const isHoriz = e.target.value === 'HORIZONTAL';
            if (isHoriz) {
              updateSelectedComponent('scrollX', true);
              updateSelectedComponent('scrollY', false);
              updateSelectedComponent('vTrackTex', '');
              updateSelectedComponent('vThumbTex', '');
            } else {
              updateSelectedComponent('scrollX', false);
              updateSelectedComponent('scrollY', true);
              updateSelectedComponent('hTrackTex', '');
              updateSelectedComponent('hThumbTex', '');
            }
          }}
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-emerald-400 cursor-pointer"
        >
          <option value="VERTICAL">↕ Vertical Only</option>
          <option value="HORIZONTAL">↔ Horizontal Only</option>
        </select>
      </div>

      <div className="border-t border-zinc-800 pt-2 flex flex-col gap-1">
        <label className="text-[11px] text-zinc-400">Panel Fixed Background (Optionnel):</label>
        {loadedAssets.length > 0 ? (
          <select
            value={selectedComponent.scrollBgTex || ''}
            onChange={(e) => updateSelectedComponent('scrollBgTex', e.target.value)}
            className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-amber-400"
          >
            <option value="">-- No Image (Transparent) --</option>
            {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
          </select>
        ) : (
          <input type="text" value={selectedComponent.scrollBgTex || ""} onChange={(e) => updateSelectedComponent('scrollBgTex', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-800 text-xs font-mono outline-none text-amber-400" placeholder="modid:textures/gui/panel_bg.png" />
        )}
      </div>

      <div className="border-t border-zinc-800 pt-2 flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
          <input type="checkbox" checked={selectedComponent.showBorder !== false} onChange={(e) => updateSelectedComponent('showBorder', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
          Enable Outline Border
        </label>
        {selectedComponent.showBorder !== false && (
          <div>
            <label className="text-[11px] text-zinc-400">Border ARGB Color</label>
            <div className="flex gap-2 mt-1">
              <input type="text" value={selectedComponent.borderColor || "0x803B82F6"} onChange={(e) => updateSelectedComponent('borderColor', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-amber-400" />
              <input
                type="color"
                value={getHtmlColor(selectedComponent.borderColor || "0x803B82F6")}
                onChange={(e) => handleColorPick(e, 'borderColor', selectedComponent.borderColor || "0x803B82F6")}
                className="w-9 h-auto p-0.5 border border-zinc-700 rounded bg-zinc-950 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 pt-1 flex flex-col gap-2">
        {(selectedComponent.scrollY !== false) ? (
          <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800 flex flex-col gap-1.5">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Vertical Layout Textures</span>
            <label className="text-[10px] text-zinc-400">Track:</label>
            <select value={selectedComponent.vTrackTex || ''} onChange={(e) => updateSelectedComponent('vTrackTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-amber-400">
              <option value="">-- Choose Asset Texture --</option>
              {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
            </select>
            <label className="text-[10px] text-zinc-400">Thumb (Puce):</label>
            <select value={selectedComponent.vThumbTex || ''} onChange={(e) => updateSelectedComponent('vThumbTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-amber-400">
              <option value="">-- Choose Asset Texture --</option>
              {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
            </select>
          </div>
        ) : (
          <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800 flex flex-col gap-1.5">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Horizontal Layout Textures</span>
            <label className="text-[10px] text-zinc-400">Track:</label>
            <select value={selectedComponent.hTrackTex || ''} onChange={(e) => updateSelectedComponent('hTrackTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-emerald-400">
              <option value="">-- Choose Asset Texture --</option>
              {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
            </select>
            <label className="text-[10px] text-zinc-400">Thumb (Puce):</label>
            <select value={selectedComponent.hThumbTex || ''} onChange={(e) => updateSelectedComponent('hThumbTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-emerald-400">
              <option value="">-- Choose Asset Texture --</option>
              {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
