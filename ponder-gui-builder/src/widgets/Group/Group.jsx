import React from 'react';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const GroupWidget = {
  type: 'Group',
  label: 'Group (Container)',
  defaultWidth: 100,
  defaultHeight: 100,
  isResizable: true,

  createInitialProps: () => ({}),

  renderCanvas: ({ comp, isSelected, childrenElements }) => {
    return (
      <div className={`w-full h-full border border-dashed rounded relative ${isSelected ? 'border-emerald-400 bg-emerald-500/5 ring-2 ring-emerald-500/20' : 'border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/5'}`}>
        <div className="absolute top-0 left-0 bg-emerald-500/20 text-emerald-300 text-[8px] px-1 rounded-br font-mono pointer-events-none">GROUP</div>
        {childrenElements}
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
