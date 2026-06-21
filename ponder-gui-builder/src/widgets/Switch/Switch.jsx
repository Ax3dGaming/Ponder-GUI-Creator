import React from 'react';
import SwitchPanel from '../../components/Inspector/panels/SwitchPanel';
import ButtonPanel from '../../components/Inspector/panels/ButtonPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const SwitchWidget = {
  type: 'Switch',
  label: 'Toggle Switch',
  defaultWidth: 40,
  defaultHeight: 20,
  isResizable: true,

  createInitialProps: () => ({
    defaultState: false,
    textureOn: '',
    textureOff: '',
    actionType: 'NONE',
    actionTarget: ''
  }),

  renderCanvas: ({ comp, isSelected }) => {
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden transition-colors
        ${comp.defaultState ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-zinc-800 border-zinc-500'}
        ${isSelected ? 'ring-2 ring-emerald-500/50' : ''}`}
      >
        <span className="truncate drop-shadow-md font-mono">
            {comp.defaultState ? 'ON' : 'OFF'}
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <SwitchPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <ButtonPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
