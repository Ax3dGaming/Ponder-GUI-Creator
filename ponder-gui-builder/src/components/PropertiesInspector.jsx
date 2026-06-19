import React from 'react';
import GlobalConfigPanel from './Inspector/panels/GlobalConfigPanel';
import ConditionPanel from './Inspector/panels/ConditionPanel';
import { WidgetRegistry } from '../widgets/WidgetRegistry';

export default function PropertiesInspector({
  selectedComponent,
  updateSelectedComponent,
  onDelete,
  loadedAssets = [],
  guiConfig,
  setGuiConfig,
  moveComponentUp,
  moveComponentDown
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

          {/* === PANNEAUX DYNAMIQUES VIA LE REGISTRE === */}
          {WidgetRegistry.renderInspector(selectedComponent.type, {
            selectedComponent,
            updateSelectedComponent,
            loadedAssets,
            guiConfig,
            getHtmlColor,
            handleColorPick
          })}

          {/* CONDITIONS */}
          <ConditionPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />

          {/* LAYER ORDER (Z-INDEX) */}
          <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase">Layer Order</span>
            <div className="flex gap-2">
              <button onClick={moveComponentUp} className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 py-1.5 px-3 rounded text-xs transition shadow border border-zinc-600">
                Move Forward
              </button>
              <button onClick={moveComponentDown} className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 py-1.5 px-3 rounded text-xs transition shadow border border-zinc-600">
                Move Backward
              </button>
            </div>
          </div>

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