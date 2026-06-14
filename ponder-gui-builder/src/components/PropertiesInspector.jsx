import React from 'react';
import { generateScrollPanelWidgetCode } from '../utils/scrollPanelGenerator';

export default function PropertiesInspector({ 
  selectedComponent, 
  updateSelectedComponent, 
  onDelete, 
  loadedAssets = [], 
  guiConfig, 
  setGuiConfig 
}) {
  return (
    <div className="w-64 bg-zinc-800 p-4 border-l border-zinc-700 flex flex-col gap-4 overflow-y-auto h-full">
      <h3 className="text-md font-bold text-zinc-300">Properties</h3>
      
      {/* ========================================================= */}
      {/* SECTION CONFIGURATION DU SCREEN GLOBAL (NETTOYÉE)         */}
      {/* ========================================================= */}
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

      {/* ========================================================= */}
      {/* INSPECTION INDIVIDUELLE DES COMPOSANTS SÉLECTIONNÉS        */}
      {/* ========================================================= */}
      {!selectedComponent ? (
        <div className="text-xs text-zinc-500 italic mt-2">Right click on any component to edit its individual properties.</div>
      ) : (
        <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-zinc-700">
          <div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono uppercase">{selectedComponent.type}</span>
          </div>
          <div>
            <label className="text-xs text-zinc-400">Unique ID (Java Fields)</label>
            <div className="text-xs text-emerald-400 bg-zinc-900 p-2 rounded mt-1 select-all font-mono break-all">{selectedComponent.id}</div>
          </div>

          {(selectedComponent.type === 'Button' || selectedComponent.type === 'Label') && (
            <div>
              <label className="text-xs text-zinc-400">Display Text</label>
              <input 
                type="text" 
                value={selectedComponent.text} 
                onChange={(e) => updateSelectedComponent('text', e.target.value)} 
                className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-sans" 
              />
            </div>
          )}

          {(selectedComponent.type === 'ImageButton' || selectedComponent.type === 'Image' || selectedComponent.type === 'PlayerInventory') && (
            <div>
              <label className="text-xs text-zinc-400">Texture Asset Location</label>
              {loadedAssets.length > 0 ? (
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
              )}
            </div>
          )}

          {selectedComponent.type === 'EditBox' && (
            <div>
              <label className="text-xs text-zinc-400">Hint / Placeholder Text</label>
              <input 
                type="text" 
                value={selectedComponent.placeholder} 
                onChange={(e) => updateSelectedComponent('placeholder', e.target.value)} 
                className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white" 
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-400">X Position</label>
              <input type="number" value={selectedComponent.x} onChange={(e) => updateSelectedComponent('x', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-mono" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Y Position</label>
              <input type="number" value={selectedComponent.y} onChange={(e) => updateSelectedComponent('y', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-400">Width (Largeur)</label>
              <input type="number" value={selectedComponent.width} disabled={selectedComponent.type === 'PlayerInventory'} onChange={(e) => updateSelectedComponent('width', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none disabled:opacity-40 text-white font-mono" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Height (Hauteur)</label>
              <input type="number" value={selectedComponent.height} disabled={selectedComponent.type === 'PlayerInventory'} onChange={(e) => updateSelectedComponent('height', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none disabled:opacity-40 text-white font-mono" />
            </div>
          </div>

          {(selectedComponent.type === 'Label' || selectedComponent.type === 'ProgressBar') && (
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-xs text-zinc-400">{selectedComponent.type === 'ProgressBar' ? 'Fill Color (Java Hex)' : 'Color (Java Hex)'}</label>
                <input 
                  type="text" 
                  value={selectedComponent.color} 
                  onChange={(e) => updateSelectedComponent('color', e.target.value)} 
                  className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 text-emerald-300 outline-none font-mono" 
                  placeholder={selectedComponent.type === 'ProgressBar' ? '0xFF10B981' : '0xFFFFFF'}
                />
              </div>
              {selectedComponent.type === 'ProgressBar' && (
                <div>
                  <label className="text-xs text-zinc-400">Background Color (Java Hex)</label>
                  <input 
                    type="text" 
                    value={selectedComponent.bgColor} 
                    onChange={(e) => updateSelectedComponent('bgColor', e.target.value)} 
                    className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 text-zinc-400 outline-none font-mono" 
                    placeholder="0xFF3F3F46"
                  />
                </div>
              )}
            </div>
          )}

          {selectedComponent.type === 'ScrollPanel' && (
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
                  <input type="checkbox" checked={selectedComponent.showBorder !== false} onChange={(e) => updateSelectedComponent('showBorder', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500"/>
                  Enable Outline Border
                </label>
                {selectedComponent.showBorder !== false && (
                  <div>
                    <label className="text-[11px] text-zinc-400">Border ARGB Color</label>
                    <input type="text" value={selectedComponent.borderColor || "0x803B82F6"} onChange={(e) => updateSelectedComponent('borderColor', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-amber-400" />
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
          )}

          {(selectedComponent.type === 'Slider' || selectedComponent.type === 'ProgressBar') && (
            <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase">{selectedComponent.type} Settings</span>
              
              {selectedComponent.type === 'Slider' && (
                <>
                  <div>
                    <label className="text-xs text-zinc-400">Slider Display Title</label>
                    <input 
                      type="text" 
                      value={selectedComponent.text || "Slider"} 
                      onChange={(e) => updateSelectedComponent('text', e.target.value)} 
                      className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none font-sans text-white" 
                    />
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
                </>
              )}

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
                  <label className="text-[10px] text-zinc-400">Value</label>
                  <input type="number" step="0.1" value={selectedComponent.currentVal} onChange={(e) => updateSelectedComponent('currentVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300" />
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={onDelete} 
            className="w-full bg-red-900/40 border border-red-700 hover:bg-red-800 text-red-200 py-1.5 px-3 rounded text-xs mt-4 transition shadow"
          >
            Delete Component
          </button>
        </div>
      )}
    </div>
  );
}