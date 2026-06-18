import React from 'react';
import GlobalConfigPanel from './Inspector/panels/GlobalConfigPanel';
import ButtonPanel from './Inspector/panels/ButtonPanel';
import SliderPanel from './Inspector/panels/SliderPanel';
import EntityPanel from './Inspector/panels/EntityPanel';
import EditBoxPanel from './Inspector/panels/EditBoxPanel';
import ItemDisplayPanel from './Inspector/panels/ItemDisplayPanel';
import TranslatableTextPanel from './Inspector/panels/TranslatableTextPanel';
import TextureConfigPanel from './Inspector/panels/TextureConfigPanel';
import LayoutPanel from './Inspector/panels/LayoutPanel';
import LabelPanel from './Inspector/panels/LabelPanel';
import ScrollPanelConfig from './Inspector/panels/ScrollPanelConfig';
import ProgressBarPanel from './Inspector/panels/ProgressBarPanel';

export default function PropertiesInspector({
  selectedComponent,
  updateSelectedComponent,
  onDelete,
  loadedAssets = [],
  guiConfig,
  setGuiConfig
}) {

  // --- HELPER LOGIC POUR LE COLOR PICKER ---
  const getHtmlColor = (javaColor) => {
    if (!javaColor) return '#ffffff';
    const clean = javaColor.replace('0x', '');
    if (clean.length >= 6) return '#' + clean.slice(-6);
    return '#ffffff';
  };

  const handleColorPick = (e, propName, currentJavaColor) => {
    const htmlHex = e.target.value.replace('#', '').toUpperCase();
    let alpha = 'FF';
    if (currentJavaColor && currentJavaColor.startsWith('0x') && currentJavaColor.length === 10) {
      alpha = currentJavaColor.substring(2, 4);
    }
    updateSelectedComponent(propName, `0x${alpha}${htmlHex}`);
  };

  return (
    <div className="w-64 bg-zinc-800 p-4 border-l border-zinc-700 flex flex-col gap-4 overflow-y-auto h-full">
      <h3 className="text-md font-bold text-zinc-300">Properties</h3>

      {/* SECTION CONFIGURATION DU SCREEN GLOBAL */}
      <GlobalConfigPanel
        guiConfig={guiConfig}
        setGuiConfig={setGuiConfig}
        loadedAssets={loadedAssets}
      />

      {/* INSPECTION INDIVIDUELLE DES COMPOSANTS SÉLECTIONNÉS */}
      {!selectedComponent ? (
        <div className="text-xs text-zinc-500 italic mt-2">Right click on any component to edit its individual properties.</div>
      ) : (
        <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-zinc-700">
          <div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono uppercase">{selectedComponent.type}</span>
          </div>
          <div>
            <label className="text-xs text-zinc-400">Unique ID (Java Fields)</label>
            <div className="text-xs text-emerald-400 bg-zinc-900 p-2 rounded mt-1 select-all font-mono break-all">{selectedComponent.id}</div>
          </div>

          {/* === PANNEAUX SPÉCIFIQUES === */}
          {['Button', 'ImageButton'].includes(selectedComponent.type) && (
            <ButtonPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
          )}
          {selectedComponent.type === 'Slider' && (
            <SliderPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} />
          )}
          {selectedComponent.type === 'EntityDisplay' && (
            <EntityPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
          )}
          {selectedComponent.type === 'EditBox' && (
            <EditBoxPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
          )}
          {selectedComponent.type === 'ItemDisplay' && (
            <ItemDisplayPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
          )}
          {selectedComponent.type === 'ScrollPanel' && (
            <ScrollPanelConfig selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} guiConfig={guiConfig} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
          )}
          {selectedComponent.type === 'ProgressBar' && (
            <ProgressBarPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
          )}

          {/* === PANNEAUX PARTAGÉS === */}
          {['Button', 'Label', 'HoverArea'].includes(selectedComponent.type) && (
            <TranslatableTextPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
          )}
          {['ImageButton', 'Image', 'PlayerInventory'].includes(selectedComponent.type) && (
            <TextureConfigPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} loadedAssets={loadedAssets} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
          )}
          {selectedComponent.type === 'Label' && (
            <LabelPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} getHtmlColor={getHtmlColor} handleColorPick={handleColorPick} />
          )}

          {/* === LAYOUT GLOBAL === */}
          <LayoutPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />

          <button
            onClick={onDelete}
            className="w-full bg-red-900/40 border border-red-700 hover:bg-red-800 text-red-200 py-1.5 px-3 rounded text-xs mt-4 transition shadow"
          >
            Delete Component
          </button>
        </div>
      )}
    </div>
  );
}