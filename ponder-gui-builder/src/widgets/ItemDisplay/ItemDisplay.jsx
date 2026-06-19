import React from 'react';
import ItemDisplayPanel from '../../components/Inspector/panels/ItemDisplayPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const ItemDisplayWidget = {
  type: 'ItemDisplay',
  label: 'Item Display',
  defaultWidth: 16,
  defaultHeight: 16,
  isResizable: false,

  createInitialProps: () => ({
    item: 'minecraft:apple',
    itemScale: 1.0,
    itemRotationX: 0,
    itemRotationY: 0,
    itemRotationZ: 0,
    showTooltip: false,
    animateRotation: false
  }),

  renderCanvas: ({ comp, isSelected }) => {
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden bg-emerald-900/30 text-emerald-400 border-emerald-600 border-dashed rounded-none
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : ''}`}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate">
          <div style={{ transform: `scale(${comp.itemScale || 1}) rotateX(${comp.itemRotationX || 0}deg) rotateY(${comp.itemRotationY || 0}deg) rotateZ(${comp.itemRotationZ || 0}deg)` }}>
            🍎
          </div>
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <ItemDisplayPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
