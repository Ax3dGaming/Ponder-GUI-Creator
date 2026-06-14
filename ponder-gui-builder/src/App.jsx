import React, { useState, useRef } from 'react';
import PropertiesInspector from './components/PropertiesInspector';
import { generateJavaCode } from './utils/javaGenerator';
import { serializeProjectJson, triggerDownload } from './utils/jsonGenerator';

export default function App() {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  // États pour le déplacement et le redimensionnement
  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });

  const [guiConfig, setGuiConfig] = useState({
    modId: "ponder",
    className: "MyCustomScreen",
    guiTitle: "Ponder Custom Menu",
    backgroundType: "VANILLA_DARK", 
    customTexture: "ponder:textures/gui/custom_background.png",
    bgWidth: 176,
    bgHeight: 166
  });

  const fileInputRef = useRef(null);

  const tools = [
    { type: 'Label', label: 'Text (Label)', defaultWidth: 100, defaultHeight: 20 },
    { type: 'Button', label: 'Button', defaultWidth: 120, defaultHeight: 20 },
    { type: 'ImageButton', label: 'Image Button', defaultWidth: 20, defaultHeight: 20 },
    { type: 'Image', label: 'Static Image', defaultWidth: 50, defaultHeight: 50 },
    { type: 'Slider', label: 'Slider Button', defaultWidth: 150, defaultHeight: 20 },
    { type: 'EditBox', label: 'Input Field', defaultWidth: 150, defaultHeight: 20 },
    { type: 'InputSlot', label: 'Input Slot (18x18)', defaultWidth: 18, defaultHeight: 18 },
    { type: 'OutputSlot', label: 'Output Slot (26x26)', defaultWidth: 26, defaultHeight: 26 },
    { type: 'ScrollPanel', label: 'Scroll Panel', defaultWidth: 200, defaultHeight: 150 },
  ];

  const handleToolDragStart = (e, tool) => {
    e.dataTransfer.setData('text/plain', 'new_tool');
    e.dataTransfer.setData('toolType', tool.type);
    e.dataTransfer.setData('defaultWidth', tool.defaultWidth);
    e.dataTransfer.setData('defaultHeight', tool.defaultHeight);
  };

  // --- ACTIONS SOURIS ---

  const handleComponentMouseDown = (e, comp) => {
    if (e.button !== 0) return; // Clic gauche seulement
    e.stopPropagation();
    setDraggingId(comp.id);
    setDragOffset({ x: e.clientX - comp.x, y: e.clientY - comp.y });
  };

  const handleResizeMouseDown = (e, comp) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setResizingId(comp.id);
    setDragOffset({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: comp.width, height: comp.height });
  };

  const handleComponentContextMenu = (e, comp) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedId(comp.id); 
  };

  const handleCanvasMouseMove = (e) => {
    if (resizingId) {
      const deltaX = e.clientX - dragOffset.x;
      const deltaY = e.clientY - dragOffset.y;
      
      setComponents(components.map(comp => {
        if (comp.id === resizingId) {
          const newWidth = Math.max(10, initialSize.width + deltaX);
          const newHeight = Math.max(10, initialSize.height + deltaY);
          return { ...comp, width: Math.round(newWidth), height: Math.round(newHeight) };
        }
        return comp;
      }));
      return;
    }

    if (!draggingId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    setComponents(components.map(comp => {
      if (comp.id === draggingId) {
        if (comp.parentId) {
          const parent = components.find(p => p.id === comp.parentId);
          newX = Math.max(0, Math.min(newX, parent.width - comp.width));
          newY = Math.max(0, Math.min(newY, 9999));
        } else {
          newX = Math.max(0, Math.min(newX, rect.width - 10));
          newY = Math.max(0, Math.min(newY, rect.height - 10));
        }
        return { ...comp, x: Math.round(newX), y: Math.round(newY) };
      }
      return comp;
    }));
  };

  const handleCanvasMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
  };

  const handleCanvasDrop = (e, targetPanelId = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.getData('text/plain') !== 'new_tool') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const type = e.dataTransfer.getData('toolType');
    if (!type) return;
    if (targetPanelId && type === 'ScrollPanel') return;

    const newComponent = {
      id: `${type.toLowerCase()}_${Date.now()}`,
      type,
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
      width: parseInt(e.dataTransfer.getData('defaultWidth'), 10),
      height: parseInt(e.dataTransfer.getData('defaultHeight'), 10),
      text: type === 'Label' || type === 'Button' || type === 'Slider' ? `My ${type}` : '',
      placeholder: type === 'EditBox' ? 'Type here...' : '',
      color: '0xFFFFFF',
      texture: 'ponder:textures/gui/widgets.png',
      parentId: targetPanelId,
      scrollX: false,
      scrollY: true,
      maxScrollDistance: 600,
      minVal: 0,
      maxVal: 100,
      currentVal: 50
    };
    
    setComponents([...components, newComponent]);
  };

  const updateSelectedComponent = (property, value) => {
    setComponents(components.map(comp => comp.id === selectedId ? { ...comp, [property]: value } : comp));
  };

  const handleDeleteComponent = () => {
    setComponents(components.filter(c => c.id !== selectedId && c.parentId !== selectedId));
    setSelectedId(null);
  };

  const selectedComponent = components.find(c => c.id === selectedId);

  const handleDownloadJava = () => {
    const javaResult = generateJavaCode(guiConfig, components);
    
    if (javaResult.type === "CONTAINER") {
      triggerDownload(javaResult.screenCode, javaResult.screenFileName, 'text/plain');
      setTimeout(() => {
        triggerDownload(javaResult.menuCode, javaResult.menuFileName, 'text/plain');
      }, 300);
    } else {
      triggerDownload(javaResult.screenCode, javaResult.screenFileName, 'text/plain');
    }
  };

  const handleDownloadJson = () => {
    const jsonOutput = serializeProjectJson(guiConfig, components);
    triggerDownload(jsonOutput, `${guiConfig.className}.json`, 'application/json');
  };

  const handleJsonImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.guiConfig && parsed.components) {
          setGuiConfig(parsed.guiConfig);
          setComponents(parsed.components);
          setSelectedId(null);
        }
      } catch (err) { alert("Error reading JSON file."); }
    };
    reader.readAsText(file);
  };

  const rootComponents = components.filter(c => !c.parentId);

  const renderComponentElement = (comp) => {
    const isSelected = selectedId === comp.id;
    return (
      <div
        key={comp.id}
        onMouseDown={(e) => handleComponentMouseDown(e, comp)}
        onContextMenu={(e) => handleComponentContextMenu(e, comp)}
        style={{ 
          position: 'absolute', 
          left: `${comp.x}px`, 
          top: `${comp.y}px`, 
          width: `${comp.width}px`, 
          height: `${comp.height}px`,
          cursor: draggingId === comp.id ? 'grabbing' : 'grab'
        }}
        className={`flex items-center justify-center text-[10px] border rounded font-sans group
          ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : 'border-zinc-700'}
          ${comp.type === 'Button' ? 'bg-zinc-700 text-zinc-200 border-zinc-500' : ''}
          ${comp.type === 'Slider' ? 'bg-zinc-600 text-zinc-100 border-zinc-400 font-medium' : ''}
          ${comp.type === 'ImageButton' ? 'bg-amber-900/30 text-amber-300 border-amber-600' : ''}
          ${comp.type === 'Image' ? 'bg-purple-950/40 text-purple-300 border-purple-600 border-dashed font-mono' : ''}
          ${comp.type === 'EditBox' ? 'bg-zinc-950 text-zinc-400 border-zinc-800 px-2' : ''}
          ${comp.type === 'InputSlot' ? 'bg-zinc-600 text-zinc-300 border-zinc-500 rounded-none' : ''}
          ${comp.type === 'OutputSlot' ? 'bg-zinc-500 text-zinc-200 border-zinc-400 rounded-none' : ''}
          ${comp.type === 'Label' ? 'text-white font-semibold' : ''}
        `}
      >
        {comp.type === 'Button' && comp.text}
        {comp.type === 'Slider' && `${comp.text} [${comp.currentVal}]`}
        {comp.type === 'ImageButton' && "IMG BTN"}
        {comp.type === 'Image' && "IMAGE"}
        {comp.type === 'Label' && comp.text}
        {comp.type === 'EditBox' && (comp.placeholder || 'Text field')}
        {comp.type === 'InputSlot' && "IN"}
        {comp.type === 'OutputSlot' && "OUT"}

        <div
          onMouseDown={(e) => handleResizeMouseDown(e, comp)}
          className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-tl cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ cursor: 'nwse-resize' }}
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-900 text-white overflow-hidden select-none">
      
      {/* 1. LEFT PANEL */}
      <div className="w-64 bg-zinc-800 p-4 border-r border-zinc-700 flex flex-col gap-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-emerald-400">Ponder GUI</h2>
        
        <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Class Configuration</span>
          <label className="text-xs">Class Name:</label>
          <input type="text" value={guiConfig.className} onChange={e => setGuiConfig({...guiConfig, className: e.target.value})} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-sm text-emerald-300 w-full outline-none"/>
          <label className="text-xs">In-Game Title:</label>
          <input type="text" value={guiConfig.guiTitle} onChange={e => setGuiConfig({...guiConfig, guiTitle: e.target.value})} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-sm w-full outline-none"/>
        </div>

        <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Screen Background</span>
          <select value={guiConfig.backgroundType} onChange={e => setGuiConfig({...guiConfig, backgroundType: e.target.value})} className="bg-zinc-950 p-1.5 rounded border border-zinc-700 text-sm w-full outline-none">
            <option value="VANILLA_DARK">Vanilla Dark Background</option>
            <option value="CONTAINER">Standard Container</option>
            <option value="CUSTOM">Custom Texture Asset</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Components</span>
          {tools.map((tool) => (
            <div key={tool.type} draggable onDragStart={(e) => handleToolDragStart(e, tool)} className="p-2.5 bg-zinc-900 border border-zinc-700 rounded cursor-grab hover:bg-zinc-700 text-sm transition">
              {tool.label}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 mt-auto pt-4 border-t border-zinc-700">
          <button onClick={handleDownloadJava} className="bg-emerald-600 hover:bg-emerald-500 font-bold py-2 px-3 rounded text-xs transition w-full">
            Export NeoForge (.java)
          </button>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={handleDownloadJson} className="bg-blue-600 hover:bg-blue-500 font-semibold py-1.5 px-2 rounded text-[11px] transition">Save Project</button>
            <button onClick={() => fileInputRef.current.click()} className="bg-zinc-700 hover:bg-zinc-600 font-semibold py-1.5 px-2 rounded text-[11px] transition">Load Project</button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleJsonImport} accept=".json" className="hidden" />
        </div>
      </div>

      {/* 2. THE CANVAS (CENTER) */}
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-4" onClick={() => setSelectedId(null)}>
        <div className="mb-2 text-xs text-zinc-400">Left click: Move | <span className="text-emerald-400 font-semibold">Hover corners: Resize</span> | Right click: Edit</div>
        <div 
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => handleCanvasDrop(e, null)} 
          onMouseMove={handleCanvasMouseMove} 
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          className="relative w-[800px] h-[500px] bg-black border border-zinc-800 rounded shadow-2xl flex items-center justify-center overflow-hidden"
        >
          
          {(guiConfig.backgroundType === "CONTAINER" || guiConfig.backgroundType === "CUSTOM") && (
            <div style={{ width: `${guiConfig.backgroundType === "CONTAINER" ? 176 : guiConfig.bgWidth}px`, height: `${guiConfig.backgroundType === "CONTAINER" ? 166 : guiConfig.bgHeight}px` }} className="absolute bg-zinc-800 border border-zinc-600 shadow-inner flex items-center justify-center pointer-events-none text-[10px] text-zinc-500 font-mono">
              GUI Background
            </div>
          )}

          {/* RENDER ROOT COMPONENTS */}
          {rootComponents.map((comp) => {
            if (comp.type === 'ScrollPanel') {
              const children = components.filter(c => c.parentId === comp.id);
              return (
                <div
                  key={comp.id}
                  onMouseDown={(e) => handleComponentMouseDown(e, comp)}
                  onContextMenu={(e) => handleComponentContextMenu(e, comp)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleCanvasDrop(e, comp.id)}
                  style={{ position: 'absolute', left: `${comp.x}px`, top: `${comp.y}px`, width: `${comp.width}px`, height: `${comp.height}px` }}
                  className={`border rounded flex flex-col bg-slate-900/40 border-blue-500/50 overflow-hidden group ${selectedId === comp.id ? 'ring-2 ring-emerald-500/30 border-emerald-400' : ''}`}
                >
                  <div className="bg-blue-950/60 text-blue-400 text-[9px] px-1.5 py-0.5 font-semibold border-b border-blue-900 pointer-events-none">Scroll Panel Container</div>
                  
                  <div className={`flex-1 relative p-1 custom-scrollbar ${comp.scrollY !== false ? 'overflow-y-auto' : 'overflow-y-hidden'} ${comp.scrollX ? 'overflow-x-auto' : 'overflow-x-hidden'}`}>
                    <div 
                      style={{ 
                        width: comp.scrollX ? `${comp.maxScrollDistance || 1000}px` : '100%', 
                        height: comp.scrollY !== false ? `${comp.maxScrollDistance || 600}px` : '100%' 
                      }} 
                      className="relative"
                    >
                      {children.map((child) => renderComponentElement(child))}
                    </div>
                  </div>

                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, comp)}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-tl cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-50"
                    style={{ cursor: 'nwse-resize' }}
                  />
                </div>
              );
            }

            return renderComponentElement(comp);
          })}
        </div>
      </div>

      {/* 3. PROPERTIES INSPECTOR */}
      <PropertiesInspector selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} onDelete={handleDeleteComponent} />

    </div>
  );
}