import React from 'react';
import PlayerDisplayPanel from '../../components/Inspector/panels/PlayerDisplayPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const PlayerDisplayWidget = {
  type: 'PlayerDisplay',
  label: 'Player Display (Skin)',
  defaultWidth: 50,
  defaultHeight: 80,
  isResizable: true,

  createInitialProps: () => ({
    targetPlayer: '%player_name%',
    isUuid: false,
    scale: 30
  }),

  renderCanvas: ({ comp, isSelected }) => {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center border rounded bg-zinc-800/50 relative overflow-hidden group
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-dashed border-zinc-500'}`}
      >
        <div className="w-8 h-8 bg-zinc-700 rounded-sm mb-2 shadow-inner flex items-center justify-center">
            <span className="text-[10px]">Head</span>
        </div>
        <div className="w-12 h-16 bg-zinc-700 rounded shadow-inner flex items-center justify-center">
            <span className="text-[10px]">Body</span>
        </div>
        <div className="absolute bottom-1 right-1 text-[8px] font-mono text-zinc-500 bg-zinc-900/80 px-1 rounded">
          {comp.targetPlayer || 'Local'}
        </div>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <PlayerDisplayPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
