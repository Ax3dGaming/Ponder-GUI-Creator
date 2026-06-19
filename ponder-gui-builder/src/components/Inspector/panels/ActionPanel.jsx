import React from 'react';

export default function ActionPanel({ selectedComponent, updateSelectedComponent }) {
  const isHoverAction = selectedComponent.hoverActionType && selectedComponent.hoverActionType !== 'NONE';

  return (
    <>
      <div className="mt-2 border-t border-zinc-800 pt-2">
        <label className="text-xs text-zinc-400">On Click Action</label>
        <select 
          value={selectedComponent.actionType || 'NONE'} 
          onChange={(e) => updateSelectedComponent('actionType', e.target.value)}
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white mt-1"
        >
          <option value="NONE">None</option>
          <option value="PRINT_CONSOLE">Print to Console</option>
          <option value="PLAY_SOUND">Play Sound</option>
          <option value="OPEN_SCREEN">Open Another Screen</option>
          <option value="OPEN_URL">Open Web URL</option>
          <option value="TOGGLE_VISIBILITY">Toggle Component Visibility</option>
          <option value="CLOSE_SCREEN">Close GUI</option>
          <option value="SEND_PACKET">Send Network Packet</option>
          <option value="EXECUTE_COMMAND">Execute Server Command</option>
          <option value="COPY_TO_CLIPBOARD">Copy to Clipboard</option>
        </select>
      </div>

      {selectedComponent.actionType === 'OPEN_SCREEN' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Target Screen Class Name</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-white font-mono" placeholder="OptionsScreen" />
        </div>
      )}

      {selectedComponent.actionType === 'PRINT_CONSOLE' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Text to print</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-white font-mono" placeholder="Button Clicked!" />
        </div>
      )}

      {selectedComponent.actionType === 'PLAY_SOUND' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Sound Event (e.g., ui.button.click)</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-white font-mono" placeholder="minecraft:ui.button.click" />
        </div>
      )}

      {selectedComponent.actionType === 'OPEN_URL' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">URL</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-sky-300 font-mono" placeholder="https://..." />
        </div>
      )}

      {selectedComponent.actionType === 'TOGGLE_VISIBILITY' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Target Component ID</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-emerald-300 font-mono" placeholder="image_12345" />
        </div>
      )}

      {selectedComponent.actionType === 'SEND_PACKET' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Packet Class Name</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-white font-mono" placeholder="MyCustomC2SPacket" />
        </div>
      )}

      {selectedComponent.actionType === 'EXECUTE_COMMAND' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Command (without slash)</label>
          <div className="text-[9px] text-zinc-500 italic mb-1 leading-tight">Use {'${'}editBoxId{'}'} to append an EditBox value. E.g., ban {'${'}player_name_box{'}'}</div>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-amber-300 font-mono" placeholder="ban ${edit_box_1}" />
        </div>
      )}

      {selectedComponent.actionType === 'COPY_TO_CLIPBOARD' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Text to Copy</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-sky-300 font-mono" placeholder="Text or ${editBoxId}" />
        </div>
      )}

      {/* --- HOVER ACTIONS --- */}
      <div className="mt-2 border-t border-zinc-800 pt-2">
        <label className="text-xs text-zinc-400">On Hover Action</label>
        <select 
          value={selectedComponent.hoverActionType || 'NONE'} 
          onChange={(e) => updateSelectedComponent('hoverActionType', e.target.value)}
          className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white mt-1"
        >
          <option value="NONE">None</option>
          <option value="PLAY_SOUND">Play Sound</option>
          <option value="PRINT_CONSOLE">Print to Console</option>
        </select>
      </div>

      {selectedComponent.hoverActionType === 'PLAY_SOUND' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Sound Event</label>
          <input type="text" value={selectedComponent.hoverActionTarget || ''} onChange={(e) => updateSelectedComponent('hoverActionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-white font-mono" placeholder="minecraft:ui.button.click" />
        </div>
      )}

      {selectedComponent.hoverActionType === 'PRINT_CONSOLE' && (
        <div className="mt-1">
          <label className="text-[10px] text-zinc-500">Text to print</label>
          <input type="text" value={selectedComponent.hoverActionTarget || ''} onChange={(e) => updateSelectedComponent('hoverActionTarget', e.target.value)} className="w-full bg-zinc-900 p-1 rounded border border-zinc-700 text-xs outline-none text-white font-mono" placeholder="Hovering!" />
        </div>
      )}
    </>
  );
}
