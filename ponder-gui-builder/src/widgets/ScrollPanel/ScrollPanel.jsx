import React from 'react';
import ScrollPanelConfig from '../../components/Inspector/panels/ScrollPanelConfig';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const ScrollPanelWidget = {
  type: 'ScrollPanel',
  label: 'Scroll Panel',
  defaultWidth: 200,
  defaultHeight: 150,
  isResizable: true,

  createInitialProps: () => ({
    scrollX: false,
    scrollY: true,
    maxScrollDistance: 600,
    widgetPackage: '',
    showBorder: true,
    borderColor: '0x803B82F6',
    scrollBgTex: '',
    vTrackTex: '',
    vThumbTex: '',
    hTrackTex: '',
    hThumbTex: ''
  }),

  // The ScrollPanel has special rendering logic because it's a container.
  // We will return a wrapper that App.jsx will populate with children.
  renderCanvas: ({ comp, isSelected, childrenElements }) => {
    return (
      <div className={`w-full h-full border rounded flex flex-col bg-slate-900/40 border-blue-500/50 overflow-hidden group 
        ${isSelected ? 'ring-2 ring-emerald-500/30 border-emerald-400' : ''}`}
      >
        <div className="bg-blue-950/60 text-blue-400 text-[9px] px-1.5 py-0.5 font-semibold border-b border-blue-900 pointer-events-none">Scroll Panel</div>
        <div className={`flex-1 relative p-1 custom-scrollbar ${comp.scrollY !== false ? 'overflow-y-auto' : 'overflow-y-hidden'} ${comp.scrollX ? 'overflow-x-auto' : 'overflow-x-hidden'}`}>
          <div style={{ width: comp.scrollX ? `${comp.maxScrollDistance || 1000}px` : '100%', height: comp.scrollY !== false ? `${comp.maxScrollDistance || 600}px` : '100%' }} className="relative">
            {childrenElements}
          </div>
        </div>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent, loadedAssets, guiConfig, getHtmlColor, handleColorPick }) => (
    <>
      <ScrollPanelConfig selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} guiConfig={guiConfig} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
