import React from 'react';
import TranslatableTextPanel from '../../components/Inspector/panels/TranslatableTextPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const HoverAreaWidget = {
  type: 'HoverArea',
  label: 'Tooltip Hover Zone',
  defaultWidth: 50,
  defaultHeight: 50,
  isResizable: true,

  createInitialProps: () => ({
    text: 'tooltip.key',
    isTranslatable: false
  }),

  renderCanvas: ({ comp, isSelected }) => {
    const displayText = comp.isTranslatable ? `[T] ${comp.text}` : comp.text;
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden border-sky-500 border-dashed bg-sky-500/10 text-sky-200 text-center p-1
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : ''}`}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate">
          {displayText || 'Hover Tooltip Area'}
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <TranslatableTextPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
