import React from 'react';

export default function GlobalConfigPanel({ guiConfig, setGuiConfig, loadedAssets }) {
  return (
    <div className="flex flex-col gap-4">
      {/* SECTION CONFIGURATION DU SCREEN GLOBAL */}
      <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700">
        <span className="text-xs font-semibold text-zinc-400 uppercase">Screen Background Texture</span>
        
        <div className="flex flex-col gap-1.5 mt-1">
          {loadedAssets.length > 0 ? (
            <select
              value={guiConfig.customTexture || ''}
              onChange={(e) => setGuiConfig({...guiConfig, customTexture: e.target.value})}
              className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300"
            >
              <option value="">-- Select background --</option>
              {loadedAssets.map(asset => (
                <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
              ))}
            </select>
          ) : (
            <input 
              type="text" 
              value={guiConfig.customTexture || ''} 
              onChange={(e) => setGuiConfig({...guiConfig, customTexture: e.target.value})} 
              className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-zinc-400" 
              placeholder="modid:textures/gui/bg.png"
            />
          )}
          
          <div className="grid grid-cols-2 gap-2 mt-2 border-t border-zinc-800 pt-2">
            <div>
              <label className="text-[10px] text-zinc-400">File Width (px):</label>
              <input 
                type="number" 
                value={guiConfig.textureWidth || 256} 
                onChange={e => setGuiConfig({...guiConfig, textureWidth: parseInt(e.target.value, 10) || 256})} 
                className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-amber-400" 
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400">File Height (px):</label>
              <input 
                type="number" 
                value={guiConfig.textureHeight || 256} 
                onChange={e => setGuiConfig({...guiConfig, textureHeight: parseInt(e.target.value, 10) || 256})} 
                className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-amber-400" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700">
        <span className="text-xs font-semibold text-zinc-400 uppercase">Screen On Init Action</span>
        <select
          value={guiConfig.onInitActionType || 'NONE'}
          onChange={(e) => setGuiConfig({...guiConfig, onInitActionType: e.target.value})}
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-400 mt-1"
        >
          <option value="NONE">None</option>
          <option value="PLAY_SOUND">Play Sound</option>
          <option value="SEND_PACKET">Send Server Packet</option>
        </select>
        {guiConfig.onInitActionType === 'PLAY_SOUND' && (
          <div>
            <label className="text-[10px] text-zinc-400">Sound ID (Vanilla or Custom):</label>
            <input type="text" value={guiConfig.onInitActionTarget || ''} onChange={(e) => setGuiConfig({...guiConfig, onInitActionTarget: e.target.value})} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="minecraft:ui.button.click" />
          </div>
        )}
        {guiConfig.onInitActionType === 'SEND_PACKET' && (
          <div>
            <label className="text-[10px] text-zinc-400">Packet/Channel ID:</label>
            <input type="text" value={guiConfig.onInitActionTarget || ''} onChange={(e) => setGuiConfig({...guiConfig, onInitActionTarget: e.target.value})} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="MyCustomPacket" />
          </div>
        )}
      </div>
    </div>
  );
}
