import React from 'react';
import SliderPanel from '../../components/Inspector/panels/SliderPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const SliderWidget = {
  type: 'Slider',
  label: 'Slider Button',
  defaultWidth: 150,
  defaultHeight: 20,
  isResizable: true,

  createInitialProps: () => ({
    text: 'My Slider',
    minVal: 0,
    maxVal: 100,
    currentVal: 50,
    actionType: 'NONE',
    actionTarget: '',
    useCustomTextures: false,
    sliderTrackTex: '',
    sliderThumbTex: '',
    sliderThumbWidth: 8
  }),

  renderCanvas: ({ comp, isSelected }) => {
    const displayText = comp.isTranslatable ? `[T] ${comp.text}` : comp.text;
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden bg-zinc-600 text-zinc-100 border-zinc-400 font-medium
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : ''}`}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate">
          {displayText} [{comp.currentVal}]
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent, loadedAssets }) => (
    <>
      <SliderPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
