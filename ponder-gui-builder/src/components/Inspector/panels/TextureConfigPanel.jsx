import React from 'react';

export default function TextureConfigPanel({ selectedComponent, updateSelectedComponent, loadedAssets, getHtmlColor, handleColorPick }) {
  return (
    <>
      {selectedComponent.type === 'Image' && (
        <div className="flex items-center gap-2 mt-1 mb-1">
          <input
            type="checkbox"
            checked={selectedComponent.isUrl === true}
            onChange={(e) => updateSelectedComponent('isUrl', e.target.checked)}
            className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500"
          />
          <label className="text-[11px] text-zinc-400">Load from Web URL</label>
        </div>
      )}

      <div>
        <label className="text-xs text-zinc-400">
          {selectedComponent.isUrl ? 'Image Web URL' : 'Texture Asset Location'}
        </label>

        {selectedComponent.isUrl ? (
          <input
            type="text"
            value={selectedComponent.texture || ''}
            onChange={(e) => updateSelectedComponent('texture', e.target.value)}
            className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-sky-300"
            placeholder="https://example.com/image.png"
          />
        ) : (
          loadedAssets.length > 0 ? (
            <select
              value={selectedComponent.texture || ''}
              onChange={(e) => updateSelectedComponent('texture', e.target.value)}
              className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300 mt-1"
            >
              <option value="">-- Select a texture asset --</option>
              {loadedAssets.map(asset => (
                <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={selectedComponent.texture || ''}
              onChange={(e) => updateSelectedComponent('texture', e.target.value)}
              className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-zinc-300"
              placeholder="modid:textures/gui/widgets.png"
            />
          )
        )}
      </div>

      {selectedComponent.type === 'Image' && (
        <div className="mt-1">
          <label className="text-xs text-zinc-400">Tint Color (Java Hex)</label>
          <div className="flex gap-2 mt-1">
            <input type="text" value={selectedComponent.color || "0xFFFFFFFF"} onChange={(e) => updateSelectedComponent('color', e.target.value)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm text-purple-300 outline-none font-mono" placeholder="0xFFFFFFFF" />
            <input type="color" value={getHtmlColor(selectedComponent.color || "0xFFFFFFFF")} onChange={(e) => handleColorPick(e, 'color', selectedComponent.color || "0xFFFFFFFF")} className="w-9 h-auto p-0.5 border border-zinc-700 rounded bg-zinc-900 cursor-pointer" title="Pick a tint color" />
          </div>
          <span className="text-[9px] text-zinc-500 block mt-1 leading-tight">Default is 0xFFFFFFFF (No Tint). Change ARGB to apply a color filter via guiGraphics.setColor in Java.</span>
        </div>
      )}
    </>
  );
}
