import React from 'react';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const InputSlotWidget = {
  type: 'InputSlot',
  label: 'Input Slot (18x18)',
  defaultWidth: 18,
  defaultHeight: 18,
  isResizable: false,

  createInitialProps: () => ({}),

  renderCanvas: ({ comp, isSelected }) => {
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border font-sans group relative overflow-hidden bg-zinc-600/30 text-zinc-300 border-zinc-500 rounded-none
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : ''}`}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate">
          IN
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
