import React from 'react';
import ProgressBarPanel from '../../components/Inspector/panels/ProgressBarPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const ProgressBarWidget = {
  type: 'ProgressBar',
  label: 'Progress Bar',
  defaultWidth: 100,
  defaultHeight: 10,
  isResizable: true,

  createInitialProps: () => ({
    minVal: 0,
    maxVal: 100,
    currentVal: 50,
    useCustomTextures: false,
    color: '0xFF10B981',
    bgColor: '0xFF3F3F46',
    bgTexture: '',
    fillTexture: ''
  }),

  renderCanvas: ({ comp, isSelected, loadedAssets }) => {
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden border-zinc-600
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : ''}`}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden" 
          style={{ 
            backgroundColor: !comp.useCustomTextures ? (comp.bgColor ? comp.bgColor.replace('0xFF', '#') : '#3f3f46') : 'transparent',
            backgroundImage: comp.useCustomTextures && comp.bgTexture ? `url(${loadedAssets.find(a => a.minecraftPath === comp.bgTexture)?.localUrl})` : 'none',
            backgroundSize: '100% 100%',
            imageRendering: 'pixelated'
          }}
        >
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-200" 
            style={{ 
              width: `${Math.max(0, Math.min(100, ((comp.currentVal - comp.minVal) / (comp.maxVal - comp.minVal)) * 100))}%`,
              backgroundColor: !comp.useCustomTextures ? (comp.color ? comp.color.replace('0xFF', '#') : '#10b981') : 'transparent',
              backgroundImage: comp.useCustomTextures && comp.fillTexture ? `url(${loadedAssets.find(a => a.minecraftPath === comp.fillTexture)?.localUrl})` : 'none',
              backgroundSize: `${comp.width}px ${comp.height}px`, 
              imageRendering: 'pixelated'
            }} 
          />
        </div>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent, loadedAssets, getHtmlColor, handleColorPick }) => (
    <>
      <ProgressBarPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
