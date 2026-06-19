import React from 'react';
import EditBoxPanel from '../../components/Inspector/panels/EditBoxPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const EditBoxWidget = {
  type: 'EditBox',
  label: 'Input Field',
  defaultWidth: 150,
  defaultHeight: 20,
  isResizable: true,

  createInitialProps: () => ({
    placeholder: 'Type here...',
    isTranslatable: false,
    actionEvent: 'ON_CHANGE',
    actionType: 'NONE',
    actionTarget: '',
    forceNumeric: false
  }),

  renderCanvas: ({ comp, isSelected }) => {
    const displayHint = comp.isTranslatable ? `[T] ${comp.placeholder}` : comp.placeholder;
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden bg-zinc-950 text-zinc-400 border-zinc-800 px-2
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : ''}`}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate">
          {displayHint || 'Text field'}
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <EditBoxPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
