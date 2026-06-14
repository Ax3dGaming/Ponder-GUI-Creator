import React, { useState, useRef } from 'react';
import PropertiesInspector from './components/PropertiesInspector';
import { generateJavaCode } from './utils/javaGenerator';
import { serializeProjectJson, triggerDownload } from './utils/jsonGenerator';

export default function App() {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });

  const [loadedAssets, setLoadedAssets] = useState([]); 

  const [guiConfig, setGuiConfig] = useState({
    modId: "pondertestgui",
    className: "MyCustomScreen",
    guiTitle: "Ponder Custom Menu",
    backgroundType: "CONTAINER", 
    customTexture: "",
    bgWidth: 176,
    bgHeight: 166,
    textureWidth: 256,
    textureHeight: 256
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
    { type: 'PlayerInventory', label: 'Player Inventory', defaultWidth: 162, defaultHeight: 76 },
    { type: 'ScrollPanel', label: 'Scroll Panel', defaultWidth: 200, defaultHeight: 150 },
  ];

  const handleToolDragStart = (e, tool) => {
    e.dataTransfer.setData('text/plain', 'new_tool');
    e.dataTransfer.setData('toolType', tool.type);
    e.dataTransfer.setData('defaultWidth', tool.defaultWidth);
    e.dataTransfer.setData('defaultHeight', tool.defaultHeight);
  };

  const handleAssetsFolderImport = (e) => {
    const files = Array.from(e.target.files);
    const textures = [];
    files.forEach(file => {
      const pathParts = file.webkitRelativePath.split('/');
      const assetsIndex = pathParts.indexOf('assets');
      if (assetsIndex !== -1 && pathParts.length > assetsIndex + 2) {
        const modId = pathParts[assetsIndex + 1];
        const fileFullPath = pathParts.slice(assetsIndex + 2).join('/');
        if (fileFullPath.startsWith('textures/') && file.name.endsWith('.png')) {
          const minecraftPath = `${modId}:${fileFullPath}`;
          const localUrl = URL.createObjectURL(file);
          textures.push({ name: file.name, minecraftPath, localUrl });
        }
      }
    });
    if (textures.length > 0) {
      setLoadedAssets(textures);
      alert(`Successfully indexed ${textures.length} textures!`);
    } else {
      alert("No valid Minecraft textures found.");
    }
  };

  const handleComponentMouseDown = (e, comp) => {
    if (e.button !== 0) return; 
    e.stopPropagation();
    setDraggingId(comp.id);
    setDragOffset({ x: e.clientX - comp.x, y: e.clientY - comp.y });
  };

  const handleResizeMouseDown = (e, comp) => {
    if (e.button !== 0) return;
    if (comp.type === 'PlayerInventory') return; 
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
          return { ...comp, width: Math.max(10, Math.round(initialSize.width + deltaX)), height: Math.max(10, Math.round(initialSize.height + deltaY)) };
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
          newX = Math.max(0, Math.min(newX, guiConfig.bgWidth - comp.width));
          newY = Math.max(0, Math.min(newY, guiConfig.bgHeight - comp.height));
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
    if (!type || (targetPanelId && type === 'ScrollPanel')) return;

    const compWidth = parseInt(e.dataTransfer.getData('defaultWidth'), 10);
    const compHeight = parseInt(e.dataTransfer.getData('defaultHeight'), 10);
    let dropX = Math.round(e.clientX - rect.left);
    let dropY = Math.round(e.clientY - rect.top);

    if (!targetPanelId) {
      dropX = Math.max(0, Math.min(dropX, guiConfig.bgWidth - compWidth));
      dropY = Math.max(0, Math.min(dropY, guiConfig.bgHeight - compHeight));
    }

    const newComponent = {
      id: `${type.toLowerCase()}_${Date.now()}`,
      type,
      x: dropX,
      y: dropY,
      width: compWidth,
      height: compHeight,
      text: type === 'Label' || type === 'Button' || type === 'Slider' ? `My ${type}` : '',
      placeholder: type === 'EditBox' ? 'Type here...' : '',
      color: '0xFFFFFF',
      texture: '',
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
      setTimeout(() => { triggerDownload(javaResult.menuCode, javaResult.menuFileName, 'text/plain'); }, 300);
    } else {
      triggerDownload(javaResult.screenCode, javaResult.screenFileName, 'text/plain');
    }
  };

  const handleDownloadJson = () => {
    triggerDownload(serializeProjectJson(guiConfig, components), `${guiConfig.className}.json`, 'application/json');
  };

  const handleJsonImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.guiConfig && parsed.components) {
          setGuiConfig(parsed.guiConfig); setComponents(parsed.components); setSelectedId(null);
        }
      } catch (err) { alert("Error reading JSON file."); }
    };
    reader.readAsText(file);
  };

  const rootComponents = components.filter(c => !c.parentId);

  const renderComponentElement = (comp) => {
    const isSelected = selectedId === comp.id;
    const associatedAsset = loadedAssets.find(a => a.minecraftPath === comp.texture);

    if (comp.type === 'PlayerInventory') {
      return (
        <div
          key={comp.id}
          onMouseDown={(e) => handleComponentMouseDown(e, comp)}
          onContextMenu={(e) => handleComponentContextMenu(e, comp)}
          style={{ 
            position: 'absolute', left: `${comp.x}px`, top: `${comp.y}px`, width: `${comp.width}px`, height: `${comp.height}px`,
            cursor: draggingId === comp.id ? 'grabbing' : 'grab',
            backgroundImage: associatedAsset ? `url(${associatedAsset.localUrl})` : 'none',
            backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', imageRendering: 'pixelated'
          }}
          className={`flex flex-col gap-1 p-1 border rounded-sm select-none group
            ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-zinc-700'}
            ${!associatedAsset ? 'bg-zinc-900/90' : ''}`}
        >
          <div className="flex flex-col gap-0.5 relative z-10">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex gap-0.5">
                {Array.from({ length: 9 }).map((_, col) => (
                  <div key={col} className={`w-[16px] h-[16px] border flex items-center justify-center text-[7px] text-zinc-600 font-mono ${!associatedAsset ? 'bg-zinc-950 border-zinc-800' : 'border-black/10 bg-black/5'}`}>
                    {(row * 9) + col + 9}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={`h-1 ${!associatedAsset ? 'border-t border-dashed border-zinc-800' : ''}`} />
          <div className="flex gap-0.5 relative z-10">
            {Array.from({ length: 9 }).map((_, col) => (
              <div key={col} className={`w-[16px] h-[16px] border flex items-center justify-center text-[7px] text-amber-500/70 font-mono font-bold ${!associatedAsset ? 'bg-zinc-950 border-zinc-700' : 'border-black/10 bg-black/5'}`}>
                {col}
              </div>
            ))}
          </div>
          <div className="absolute -top-3.5 left-0 text-[8px] font-semibold text-zinc-400 bg-zinc-900 px-1 border border-zinc-700 border-b-0 rounded-t-sm uppercase pointer-events-none">
            Player Inv
          </div>
        </div>
      );
    }

    return (
      <div
        key={comp.id}
        onMouseDown={(e) => handleComponentMouseDown(e, comp)}
        onContextMenu={(e) => handleComponentContextMenu(e, comp)}
        style={{ 
          position: 'absolute', left: `${comp.x}px`, top: `${comp.y}px`, width: `${comp.width}px`, height: `${comp.height}px`,
          cursor: draggingId === comp.id ? 'grabbing' : 'grab',
          backgroundImage: associatedAsset ? `url(${associatedAsset.localUrl})` : 'none',
          backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', imageRendering: 'pixelated'
        }}
        className={`flex items-center justify-center text-[10px] border rounded font-sans group
          ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-950/10' : 'border-zinc-700'}
          ${comp.type === 'Button' ? 'bg-zinc-700 text-zinc-200 border-zinc-500' : ''}
          ${comp.type === 'Slider' ? 'bg-zinc-600 text-zinc-100 border-zinc-400 font-medium' : ''}
          ${comp.type === 'ImageButton' && !associatedAsset ? 'bg-amber-900/30 text-amber-300 border-amber-600' : ''}
          ${comp.type === 'Image' && !associatedAsset ? 'bg-purple-950/40 text-purple-300 border-purple-600 border-dashed font-mono' : ''}
          ${comp.type === 'EditBox' ? 'bg-zinc-950 text-zinc-400 border-zinc-800 px-2' : ''}
          ${comp.type === 'InputSlot' ? 'bg-zinc-600/30 text-zinc-300 border-zinc-500 rounded-none' : ''}
          ${comp.type === 'OutputSlot' ? 'bg-zinc-500/30 text-zinc-200 border-zinc-400 rounded-none' : ''}
          ${comp.type === 'Label' ? 'text-white font-semibold' : ''}
        `}
      >
        {comp.type === 'Button' && comp.text}
        {comp.type === 'Slider' && `${comp.text} [${comp.currentVal}]`}
        {comp.type === 'ImageButton' && !associatedAsset && "IMG BTN"}
        {comp.type === 'Image' && !associatedAsset && "IMAGE"}
        {comp.type === 'Label' && comp.text}
        {comp.type === 'EditBox' && (comp.placeholder || 'Text field')}
        {comp.type === 'InputSlot' && "IN"}
        {comp.type === 'OutputSlot' && "OUT"}

        <div
          onMouseDown={(e) => handleResizeMouseDown(e, comp)}
          className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-tl cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-40"
        />
      </div>
    );
  };

  return (
    <div 
      style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }} 
      className="bg-zinc-900 text-white overflow-hidden select-none"
    >
      
      {/* 1. LEFT PANEL */}
      <div style={{ width: '16rem' }} className="bg-zinc-800 p-4 border-r border-zinc-700 flex flex-col gap-4 overflow-hidden flex-shrink-0">
        <h2 className="text-xl font-bold text-emerald-400 flex-shrink-0">Ponder GUI</h2>
        
        {/* BLOC CONFIG */}
        <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700 flex-shrink-0">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Class Configuration</span>
          
          <label className="text-xs">Mod ID:</label>
          <input 
            type="text" 
            value={guiConfig.modId} 
            onChange={e => setGuiConfig({...guiConfig, modId: e.target.value})} 
            className="bg-zinc-950 p-1 rounded border border-zinc-700 text-sm text-amber-400 w-full outline-none font-mono"
          />

          <label className="text-xs">Class Name:</label>
          <input type="text" value={guiConfig.className} onChange={e => setGuiConfig({...guiConfig, className: e.target.value})} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-sm text-emerald-300 w-full outline-none"/>
          
          <label className="text-xs">In-Game Title:</label>
          <input type="text" value={guiConfig.guiTitle} onChange={e => setGuiConfig({...guiConfig, guiTitle: e.target.value})} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-sm w-full outline-none"/>
          
          <div className="grid grid-cols-2 gap-2 mt-1 border-t border-zinc-800 pt-2">
            <div>
              <label className="text-[10px] text-zinc-400">GUI Width (px):</label>
              <input type="number" value={guiConfig.bgWidth} onChange={e => setGuiConfig({...guiConfig, bgWidth: parseInt(e.target.value, 10) || 0})} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-emerald-300" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400">GUI Height (px):</label>
              <input type="number" value={guiConfig.bgHeight} onChange={e => setGuiConfig({...guiConfig, bgHeight: parseInt(e.target.value, 10) || 0})} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-emerald-300" />
            </div>
          </div>
        </div>

        {/* ASSET MANAGER */}
        <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700 flex-shrink-0">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Asset Manager</span>
          <label className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-1.5 px-2 rounded text-xs text-center cursor-pointer transition w-full">
            Load Assets Folder
            <input type="file" webkitdirectory="true" directory="true" onChange={handleAssetsFolderImport} className="hidden" />
          </label>
          {loadedAssets.length > 0 && <span className="text-[10px] text-emerald-400 font-mono text-center">{loadedAssets.length} textures linked</span>}
        </div>

        {/* BLOC COMPONENTS SCROLLABLE */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <span className="text-xs font-semibold text-zinc-400 uppercase flex-shrink-0">Components</span>
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 custom-scrollbar">
            {tools.map((tool) => (
              <div key={tool.type} draggable onDragStart={(e) => handleToolDragStart(e, tool)} className="p-2.5 bg-zinc-900 border border-zinc-700 rounded cursor-grab hover:bg-zinc-700 text-sm transition flex-shrink-0">
                {tool.label}
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col gap-1.5 pt-4 border-t border-zinc-700 flex-shrink-0">
          <button onClick={handleDownloadJava} className="bg-emerald-600 hover:bg-emerald-500 font-bold py-2 px-3 rounded text-xs transition w-full">Export NeoForge (.java)</button>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={handleDownloadJson} className="bg-blue-600 hover:bg-blue-500 font-semibold py-1.5 px-2 rounded text-[11px] transition">Save Project</button>
            <button onClick={() => fileInputRef.current.click()} className="bg-zinc-700 hover:bg-zinc-600 font-semibold py-1.5 px-2 rounded text-[11px] transition">Load Project</button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleJsonImport} accept=".json" className="hidden" />
        </div>
      </div>

      {/* 2. THE CANVAS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="bg-zinc-950 p-4 overflow-hidden" onClick={() => setSelectedId(null)}>
        <div className="mb-3 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800 backdrop-blur-sm pointer-events-none">
          Left click: Move | Hover corners: Resize | Right click: Edit
        </div>
        
        <div 
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => handleCanvasDrop(e, null)} 
          onMouseMove={handleCanvasMouseMove} 
          onMouseUp={handleCanvasMouseUp} 
          onMouseLeave={handleCanvasMouseUp}
          style={{ 
            width: `${guiConfig.bgWidth}px`, 
            height: `${guiConfig.bgHeight}px`,
          }}
          className="relative bg-zinc-800 border border-zinc-700 shadow-2xl overflow-visible flex-shrink-0 transition-all duration-150"
        >
          {/* Rendu visuel de la texture si elle existe, sinon fond gris standard de conteneur */}
          {guiConfig.backgroundType === "CUSTOM" && (() => {
            const bgAsset = loadedAssets.find(a => a.minecraftPath === guiConfig.customTexture);
            return bgAsset ? (
              <div 
                style={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  backgroundImage: `url(${bgAsset.localUrl})`,
                  backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', imageRendering: 'pixelated'
                }} 
                className="pointer-events-none"
              />
            ) : null;
          })()}

          {/* Repère visuel temporaire du point 0,0 */}
          <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-red-500 z-50 pointer-events-none" title="Point 0,0" />

          {/* Rendu des composants enfants direct */}
          {rootComponents.map((comp) => {
            if (comp.type === 'ScrollPanel') {
              const children = components.filter(c => c.parentId === comp.id);
              return (
                <div
                  key={comp.id} onMouseDown={(e) => handleComponentMouseDown(e, comp)} onContextMenu={(e) => handleComponentContextMenu(e, comp)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleCanvasDrop(e, comp.id)}
                  style={{ position: 'absolute', left: `${comp.x}px`, top: `${comp.y}px`, width: `${comp.width}px`, height: `${comp.height}px` }}
                  className={`border rounded flex flex-col bg-slate-900/40 border-blue-500/50 overflow-hidden group ${selectedId === comp.id ? 'ring-2 ring-emerald-500/30 border-emerald-400' : ''}`}
                >
                  <div className="bg-blue-950/60 text-blue-400 text-[9px] px-1.5 py-0.5 font-semibold border-b border-blue-900 pointer-events-none">Scroll Panel</div>
                  <div className={`flex-1 relative p-1 custom-scrollbar ${comp.scrollY !== false ? 'overflow-y-auto' : 'overflow-y-hidden'} ${comp.scrollX ? 'overflow-x-auto' : 'overflow-x-hidden'}`}>
                    <div style={{ width: comp.scrollX ? `${comp.maxScrollDistance || 1000}px` : '100%', height: comp.scrollY !== false ? `${comp.maxScrollDistance || 600}px` : '100%' }} className="relative">
                      {children.map((child) => renderComponentElement(child))}
                    </div>
                  </div>
                  <div onMouseDown={(e) => handleResizeMouseDown(e, comp)} className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-tl cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-50" />
                </div>
              );
            }
            return renderComponentElement(comp);
          })}
        </div>
      </div>

      {/* 3. PROPERTIES INSPECTOR */}
      <PropertiesInspector 
        selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} onDelete={handleDeleteComponent} 
        loadedAssets={loadedAssets} guiConfig={guiConfig} setGuiConfig={setGuiConfig}
      />

    </div>
  );
}