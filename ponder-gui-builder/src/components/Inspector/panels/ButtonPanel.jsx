import React from 'react';

export default function ButtonPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Click Action</span>
      <select
        value={selectedComponent.actionType || 'NONE'}
        onChange={(e) => updateSelectedComponent('actionType', e.target.value)}
        className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-400"
      >
        <option value="NONE">None (Manual later)</option>
        <option value="OPEN_SCREEN">Open Another Screen</option>
        <option value="CLOSE_SCREEN">Close Current Screen</option>
        <option value="PRINT_CONSOLE">Print to Console</option>
        <option value="PLAY_SOUND">Play Sound</option>
        <option value="OPEN_URL">Open Web URL</option>
        <option value="TOGGLE_VISIBILITY">Toggle Component Visibility</option>
        <option value="SEND_PACKET">Send Server Packet</option>
      </select>

      {selectedComponent.actionType === 'OPEN_SCREEN' && (
        <div>
          <label className="text-[10px] text-zinc-400">Target Screen Class Name:</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="MyOtherScreen" />
        </div>
      )}
      {selectedComponent.actionType === 'PRINT_CONSOLE' && (
        <div>
          <label className="text-[10px] text-zinc-400">Message to print:</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-sans mt-1" placeholder="Button clicked!" />
        </div>
      )}
      {selectedComponent.actionType === 'PLAY_SOUND' && (
        <div>
          <label className="text-[10px] text-zinc-400">Sound ID:</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="minecraft:ui.button.click" />
        </div>
      )}
      {selectedComponent.actionType === 'OPEN_URL' && (
        <div>
          <label className="text-[10px] text-zinc-400">Web URL:</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="https://discord.gg/..." />
        </div>
      )}
      {selectedComponent.actionType === 'TOGGLE_VISIBILITY' && (
        <div>
          <label className="text-[10px] text-zinc-400">Target Component ID:</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="label_12345" />
        </div>
      )}
      {selectedComponent.actionType === 'SEND_PACKET' && (
        <div>
          <label className="text-[10px] text-zinc-400">Packet/Channel ID:</label>
          <input type="text" value={selectedComponent.actionTarget || ''} onChange={(e) => updateSelectedComponent('actionTarget', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none text-white font-mono mt-1" placeholder="BuyItemPacket" />
        </div>
      )}
    </div>
  );
}
