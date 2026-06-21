import React from 'react';
import DropdownPanel from '../../components/Inspector/panels/DropdownPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';

export const DropdownWidget = {
  type: 'Dropdown',
  label: 'Dropdown (ComboBox)',
  defaultWidth: 100,
  defaultHeight: 20,
  isResizable: true,

  createInitialProps: () => ({
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedIndex: 0,
    buttonTexture: '',
    listTexture: '',
    isUrlButton: false,
    isUrlList: false
  }),

  renderCanvas: ({ comp, isSelected }) => {
    const opts = comp.options || [''];
    const displayOpt = opts[comp.selectedIndex] || opts[0] || 'Select...';

    return (
      <div className={`w-full h-full flex items-center justify-between px-2 text-[10px] border rounded font-sans group relative overflow-hidden bg-zinc-800 text-zinc-200
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-zinc-500'}`}
      >
        <span className="truncate">{displayOpt}</span>
        <span className="text-[8px] text-zinc-400">▼</span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <DropdownPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
