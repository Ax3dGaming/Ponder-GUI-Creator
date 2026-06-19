import React from 'react';
import ActionPanel from './ActionPanel';

export default function ButtonPanel({ selectedComponent, updateSelectedComponent }) {
  return (
    <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
      <span className="text-xs font-semibold text-zinc-400 uppercase">Actions</span>
      <ActionPanel selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} />
    </div>
  );
}
