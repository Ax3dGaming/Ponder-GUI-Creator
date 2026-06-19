import React from 'react';
import TextureConfigPanel from '../../components/Inspector/panels/TextureConfigPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const ImageWidget = {
  type: 'Image',
  label: 'Static Image',
  defaultWidth: 50,
  defaultHeight: 50,
  isResizable: true,

  createInitialProps: () => ({
    texture: 'minecraft:textures/gui/container/inventory.png',
    isUrl: false,
    color: '0xFFFFFFFF',
    u: 0,
    v: 0
  }),

  renderCanvas: ({ comp, isSelected, loadedAssets }) => {
    const associatedAsset = loadedAssets.find(a => a.minecraftPath === comp.texture);
    
    return (
      <div 
        className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : 'border-zinc-700'}
        ${!associatedAsset ? 'bg-purple-950/40 text-purple-300 border-purple-600 border-dashed font-mono' : ''}`}
        style={{
          backgroundImage: associatedAsset ? `url(${associatedAsset.localUrl})` : 
                           (comp.isUrl && comp.texture ? `url(${comp.texture})` : 'none'),
          backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', imageRendering: 'pixelated'
        }}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate">
          {!associatedAsset && "IMAGE"}
        </span>
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
