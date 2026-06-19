import React from 'react';
import TextureConfigPanel from '../../components/Inspector/panels/TextureConfigPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const PlayerInventoryWidget = {
  type: 'PlayerInventory',
  label: 'Player Inventory',
  defaultWidth: 162,
  defaultHeight: 76,
  isResizable: false,

  createInitialProps: () => ({
    texture: ''
  }),

  renderCanvas: ({ comp, isSelected, loadedAssets }) => {
    const associatedAsset = loadedAssets.find(a => a.minecraftPath === comp.texture);
    
    return (
      <div 
        className={`w-full h-full flex flex-col gap-1 p-1 border rounded-sm select-none group
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-zinc-700'}
        ${!associatedAsset ? 'bg-zinc-900/90' : ''}`}
        style={{
          backgroundImage: associatedAsset ? `url(${associatedAsset.localUrl})` : 'none',
          backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', imageRendering: 'pixelated'
        }}
      >
        <div className="flex flex-col gap-0.5 relative z-10 pointer-events-none w-full items-center">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-0.5">
              {Array.from({ length: 9 }).map((_, col) => (
                <div key={col} className={`w-[16px] h-[16px] border flex items-center justify-center text-[7px] text-zinc-600 font-mono ${!associatedAsset ? 'bg-zinc-950 border-zinc-800' : 'border-black/10 bg-black/5'}`}>
                  {(row * 9) + col + 9}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={`h-1 w-full ${!associatedAsset ? 'border-t border-dashed border-zinc-800' : ''}`} />
        <div className="flex gap-0.5 relative z-10 pointer-events-none w-full items-center justify-center">
          {Array.from({ length: 9 }).map((_, col) => (
            <div key={col} className={`w-[16px] h-[16px] border flex items-center justify-center text-[7px] text-amber-500/70 font-mono font-bold ${!associatedAsset ? 'bg-zinc-950 border-zinc-700' : 'border-black/10 bg-black/5'}`}>
              {col}
            </div>
          ))}
        </div>
        <div className="absolute -top-3.5 left-0 text-[8px] font-semibold text-zinc-400 bg-zinc-900 px-1 border border-zinc-700 border-b-0 rounded-t-sm uppercase pointer-events-none">
          Player Inv
        </div>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent, loadedAssets, getHtmlColor, handleColorPick }) => (
    <>
      <TextureConfigPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
