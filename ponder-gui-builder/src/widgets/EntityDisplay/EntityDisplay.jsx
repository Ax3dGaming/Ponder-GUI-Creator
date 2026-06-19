import React from 'react';
import EntityPanel from '../../components/Inspector/panels/EntityPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const EntityDisplayWidget = {
  type: 'EntityDisplay',
  label: 'Entity Display',
  defaultWidth: 40,
  defaultHeight: 60,
  isResizable: true,

  createInitialProps: () => ({
    entity: 'minecraft:zombie',
    entityScale: 30,
    entityRotationX: 0,
    entityRotationY: 0,
    entityRotationZ: 0,
    entityFollowMouse: true,
    animateRotation: false
  }),

  renderCanvas: ({ comp, isSelected }) => {
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden bg-red-900/30 text-red-400 border-red-600 border-dashed rounded-none
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : ''}`}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate">
          <div className="flex flex-col items-center gap-0.5 text-[8px]">
            <span>🧟</span>
            <span className="opacity-60">Sc:{comp.entityScale}</span>
            {!comp.entityFollowMouse && <span className="opacity-60">R:{comp.entityRotationY}°</span>}
          </div>
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <EntityPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
