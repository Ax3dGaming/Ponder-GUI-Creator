import React from 'react';
import TranslatableTextPanel from '../../components/Inspector/panels/TranslatableTextPanel';
import LabelPanel from '../../components/Inspector/panels/LabelPanel';
import LayoutPanel from '../../components/Inspector/panels/LayoutPanel';
import { parseMinecraftFormatting } from '../../utils/textFormatting';
import { parsePlaceholdersReact } from '../../placeholders/PlaceholderRegistry';

export const LabelWidget = {
  type: 'Label',
  label: 'Text (Label)',
  defaultWidth: 100,
  defaultHeight: 20,
  isResizable: true,

  createInitialProps: () => ({
    text: 'My Label',
    isTranslatable: false,
    color: '0xFFFFFF'
  }),

  renderCanvas: ({ comp, isSelected }) => {
    const displayText = comp.isTranslatable ? `[T] ${comp.text}` : comp.text;
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] border rounded font-sans group relative overflow-hidden text-white font-semibold
        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : 'border-zinc-700'}`}
      >
        <span className="relative z-10 pointer-events-none w-full h-full flex flex-col items-center justify-center text-center truncate drop-shadow-md">
          {parseMinecraftFormatting(parsePlaceholdersReact(displayText))}
        </span>
      </div>
    );
  },

  renderInspector: ({ selectedComponent, updateSelectedComponent, getHtmlColor, handleColorPick }) => (
    <>
      <TranslatableTextPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
      <LabelPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
      <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </>
  )
};
