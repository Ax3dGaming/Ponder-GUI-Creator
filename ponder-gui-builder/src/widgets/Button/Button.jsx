import React from 'react';
import ButtonPanel from '../../components/Inspector/panels/ButtonPanel';
import TranslatableTextPanel from '../../components/Inspector/panels/TranslatableTextPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';
import { parseMinecraftFormatting } from '../../utils/textFormatting';
import { parsePlaceholdersReact } from '../../placeholders/PlaceholderRegistry';

export const ButtonWidget = {
  type: 'Button',
  label: 'Button',
  defaultWidth: 120,
  defaultHeight: 20,
  isResizable: true,

  createInitialProps: () => ({
    text: 'My Button',
    isTranslatable: false,
    actionType: 'NONE',
    actionTarget: ''
  }),

  renderCanvas: ({ comp, isSelected }) => {
    const displayText = comp.isTranslatable ? `[T] ${comp.text}` : comp.text;
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden bg-zinc-700 text-zinc-200 border-zinc-500
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : ''}`}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate drop-shadow-md">
          {parseMinecraftFormatting(parsePlaceholdersReact(displayText))}
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent }) => (
    <>
      <ButtonPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <TranslatableTextPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
