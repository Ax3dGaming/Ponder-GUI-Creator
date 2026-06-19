import React from 'react';
import ButtonPanel from '../../components/Inspector/panels/ButtonPanel';
import TextureConfigPanel from '../../components/Inspector/panels/TextureConfigPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';
import DisabledStatePanel from '../../components/Inspector/panels/DisabledStatePanel';

export const ImageButtonWidget = {
  type: 'ImageButton',
  label: 'Image Button',
  defaultWidth: 20,
  defaultHeight: 20,
  isResizable: true,

  createInitialProps: () => ({
    actionType: 'NONE',
    actionTarget: '',
    texture: '',
    isUrl: false
  }),

  renderCanvas: ({ comp, isSelected, loadedAssets }) => {
    const associatedAsset = loadedAssets.find(a => a.minecraftPath === comp.texture);
    
    return (
      <div 
        className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : 'border-zinc-700'}
        ${!associatedAsset ? 'bg-amber-900/30 text-amber-300 border-amber-600' : ''}`}
        style={{
          backgroundImage: associatedAsset ? `url(${associatedAsset.localUrl})` : 'none',
          backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', imageRendering: 'pixelated'
        }}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate">
          {!associatedAsset && "IMG BTN"}
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent, loadedAssets, getHtmlColor, handleColorPick }) => (
    <>
      <ButtonPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <ActionPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <TextureConfigPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
      <DisabledStatePanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
