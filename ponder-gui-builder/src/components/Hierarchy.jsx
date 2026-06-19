import React from 'react';
import { WidgetRegistry } from '../widgets/WidgetRegistry';

export default function Hierarchy({ components, selectedId, selectedIds = [], setSelectedId, setSelectedIds }) {
  const rootComponents = components.filter(c => !c.parentId);

  const handleSelect = (e, id) => {
    e.stopPropagation();
    if (e.shiftKey && setSelectedIds) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedId(id);
      if (setSelectedIds) setSelectedIds([id]);
    }
  };

  const renderTree = (comps, depth = 0) => {
    return comps.map(comp => {
      const isSelected = selectedId === comp.id || selectedIds.includes(comp.id);
      const children = components.filter(c => c.parentId === comp.id);
      const widget = WidgetRegistry.getWidget(comp.type);
      
      return (
        <div key={comp.id}>
          <div 
            onClick={(e) => handleSelect(e, comp.id)}
            className={`flex items-center px-2 py-1 cursor-pointer text-xs select-none transition-colors border-l-2
              ${isSelected ? 'bg-emerald-900/40 border-emerald-400 text-emerald-100' : 'hover:bg-zinc-700 border-transparent text-zinc-300'}`}
            style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
          >
            <span className="text-zinc-500 mr-1.5 w-3 h-3 flex items-center justify-center font-mono text-[10px]">
                {children.length > 0 ? '▼' : '•'}
            </span>
            <span className="truncate">{widget ? widget.label : comp.type}</span>
            <span className="ml-auto text-[9px] text-zinc-600 font-mono hidden group-hover:inline-block truncate max-w-[60px]">{comp.id}</span>
          </div>
          {children.length > 0 && (
            <div className="flex flex-col">
              {renderTree(children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col bg-zinc-900 border border-zinc-700 rounded overflow-hidden">
      <div className="flex-1 overflow-y-auto max-h-48 custom-scrollbar py-1">
        {rootComponents.length === 0 ? (
            <div className="p-3 text-center text-xs text-zinc-500 italic">No components</div>
        ) : (
            renderTree(rootComponents)
        )}
      </div>
    </div>
  );
}
