import React, { useState, useRef, useEffect } from 'react';
import PropertiesInspector from './components/PropertiesInspector';
import { generateJavaCode } from './utils/javaGenerator';
import { serializeProjectJson, triggerDownload } from './utils/jsonGenerator';
import { WidgetRegistry } from './widgets/WidgetRegistry';

export default function App() {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0, origX: 0, origY: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });

  const [snapEnabled, setSnapEnabled] = useState(false);
  const [snapSize, setSnapSize] = useState(2);

  const [loadedAssets, setLoadedAssets] = useState([]);

  const [guiConfig, setGuiConfig] = useState({
    modId: "pondertestgui",
    className: "MyCustomScreen",
    guiTitle: "Ponder Custom Menu",
    menuPackage: "",
    screenPackage: "",
    backgroundType: "CUSTOM",
    customTexture: "",
    bgWidth: 176,
    bgHeight: 166,
    textureWidth: 256,
    textureHeight: 256,
    onInitActionType: "NONE",
    onInitActionTarget: ""
  });

  const fileInputRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const workspaceRef = useRef(null);

  const tools = WidgetRegistry.getTools();

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
    if (e.button !== 0 || isPanning) return;
    e.stopPropagation();
    setDraggingId(comp.id);
    setDragOffset({ startX: e.clientX, startY: e.clientY, origX: comp.x, origY: comp.y });
  };

  const handleResizeMouseDown = (e, comp) => {
    if (e.button !== 0 || isPanning) return;
    const widget = WidgetRegistry.getWidget(comp.type);
    if (!widget || !widget.isResizable) return;
    e.stopPropagation();
    e.preventDefault();
    setResizingId(comp.id);
    setDragOffset({ startX: e.clientX, startY: e.clientY });
    setInitialSize({ width: comp.width, height: comp.height });
  };

  const handleComponentContextMenu = (e, comp) => {
    e.preventDefault(); e.stopPropagation();
    setSelectedId(comp.id);
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      });
      return;
    }

    if (resizingId) {
      const deltaX = (e.clientX - dragOffset.startX) / scale;
      const deltaY = (e.clientY - dragOffset.startY) / scale;

      setComponents(components.map(comp => {
        if (comp.id === resizingId) {
          return {
            ...comp,
            width: Math.max(10, Math.round(initialSize.width + deltaX)),
            height: Math.max(10, Math.round(initialSize.height + deltaY))
          };
        }
        return comp;
      }));
      return;
    }

    if (!draggingId) return;

    const deltaX = (e.clientX - dragOffset.startX) / scale;
    const deltaY = (e.clientY - dragOffset.startY) / scale;

    setComponents(components.map(comp => {
      if (comp.id === draggingId) {
        let newX = dragOffset.origX + deltaX;
        let newY = dragOffset.origY + deltaY;

        if (snapEnabled) {
          newX = Math.round(newX / snapSize) * snapSize;
          newY = Math.round(newY / snapSize) * snapSize;
        }

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
    setIsPanning(false);
  };

  const handleWorkspaceMouseDown = (e) => {
    if (e.button === 1 || e.button === 2 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    } else {
      setSelectedId(null);
    }
  };

  const handleWorkspaceWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.max(0.2, Math.min(scale + delta, 5));
      setScale(newScale);
    }
  };

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (workspace) {
      const preventDefaultWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
        }
      };
      workspace.addEventListener('wheel', preventDefaultWheel, { passive: false });
      return () => workspace.removeEventListener('wheel', preventDefaultWheel);
    }
  }, []);

  const handleCanvasDrop = (e, targetPanelId = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.getData('text/plain') !== 'new_tool') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const type = e.dataTransfer.getData('toolType');
    if (!type || (targetPanelId && type === 'ScrollPanel')) return;

    const compWidth = parseInt(e.dataTransfer.getData('defaultWidth'), 10);
    const compHeight = parseInt(e.dataTransfer.getData('defaultHeight'), 10);

    let dropX = Math.round((e.clientX - rect.left) / scale);
    let dropY = Math.round((e.clientY - rect.top) / scale);

    dropX -= Math.round(compWidth / 2);
    dropY -= Math.round(compHeight / 2);

    if (snapEnabled) {
      dropX = Math.round(dropX / snapSize) * snapSize;
      dropY = Math.round(dropY / snapSize) * snapSize;
    }

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
      parentId: targetPanelId,
      ...WidgetRegistry.getInitialProps(type)
    };
    setComponents([...components, newComponent]);
  };

  const updateSelectedComponent = (property, value) => {
    setComponents(prevComponents =>
      prevComponents.map(comp => {
        if (comp.id === selectedId) {
          const updated = { ...comp, [property]: value };

          if (property === 'scrollX' && value === true) {
            updated.scrollY = false;
            updated.vTrackTex = '';
            updated.vThumbTex = '';
          } else if (property === 'scrollY' && value === true) {
            updated.scrollX = false;
            updated.hTrackTex = '';
            updated.hThumbTex = '';
          }

          return updated;
        }
        return comp;
      })
    );
  };

  const handleDeleteComponent = () => {
    setComponents(components.filter(c => c.id !== selectedId && c.parentId !== selectedId));
    setSelectedId(null);
  };

  const moveComponentUp = () => {
    if (!selectedId) return;
    const idx = components.findIndex(c => c.id === selectedId);
    if (idx >= components.length - 1) return;
    const newComps = [...components];
    [newComps[idx], newComps[idx + 1]] = [newComps[idx + 1], newComps[idx]];
    setComponents(newComps);
  };

  const moveComponentDown = () => {
    if (!selectedId) return;
    const idx = components.findIndex(c => c.id === selectedId);
    if (idx <= 0) return;
    const newComps = [...components];
    [newComps[idx], newComps[idx - 1]] = [newComps[idx - 1], newComps[idx]];
    setComponents(newComps);
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
          setGuiConfig({ ...parsed.guiConfig, backgroundType: "CUSTOM" });
          setComponents(parsed.components); setSelectedId(null);
        }
      } catch (err) { alert("Error reading JSON file."); }
    };
    reader.readAsText(file);
  };

  const rootComponents = components.filter(c => !c.parentId);

  const renderComponentElement = (comp) => {
    const isSelected = selectedId === comp.id;
    const widget = WidgetRegistry.getWidget(comp.type);
    const isResizable = widget ? widget.isResizable : false;

    if (comp.type === 'ScrollPanel') {
      const children = components.filter(c => c.parentId === comp.id);
      const childrenElements = children.map(child => renderComponentElement(child));
      return (
        <div
          key={comp.id} onMouseDown={(e) => handleComponentMouseDown(e, comp)} onContextMenu={(e) => handleComponentContextMenu(e, comp)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleCanvasDrop(e, comp.id)}
          style={{ position: 'absolute', left: `${comp.x}px`, top: `${comp.y}px`, width: `${comp.width}px`, height: `${comp.height}px` }}
          className="group"
        >
          {WidgetRegistry.renderCanvas(comp.type, { comp, isSelected, loadedAssets, childrenElements })}
          {isResizable && (
            <div onMouseDown={(e) => handleResizeMouseDown(e, comp)} className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-tl cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-50" />
          )}
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
          cursor: draggingId === comp.id ? 'grabbing' : 'grab'
        }}
        className="group"
      >
        {WidgetRegistry.renderCanvas(comp.type, { comp, isSelected, loadedAssets })}
        {isResizable && (
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, comp)}
            className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-tl cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-40"
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}
      className="bg-zinc-900 text-white overflow-hidden select-none"
    >

      {/* 1. LEFT PANEL */}
      <div style={{ width: '16rem', zIndex: 50 }} className="bg-zinc-800 p-4 border-r border-zinc-700 flex flex-col gap-4 overflow-hidden flex-shrink-0 relative">
        <h2 className="text-xl font-bold text-emerald-400 flex-shrink-0">Ponder GUI</h2>

        <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700 flex-shrink-0">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Class Configuration</span>

          <label className="text-xs">Mod ID:</label>
          <input type="text" value={guiConfig.modId} onChange={e => setGuiConfig({ ...guiConfig, modId: e.target.value })} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-sm text-amber-400 w-full outline-none font-mono" />

          <label className="text-xs mt-1">Class Name:</label>
          <input type="text" value={guiConfig.className} onChange={e => setGuiConfig({ ...guiConfig, className: e.target.value })} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-sm text-emerald-300 w-full outline-none" />

          <label className="text-xs mt-1">Menu Package (Optional):</label>
          <input type="text" value={guiConfig.menuPackage || ""} onChange={e => setGuiConfig({ ...guiConfig, menuPackage: e.target.value })} placeholder={`com.${guiConfig.modId}.world.inventory`} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] w-full outline-none font-mono text-zinc-300 placeholder:text-zinc-600" />

          <label className="text-xs mt-1">Screen Package (Optional):</label>
          <input type="text" value={guiConfig.screenPackage || ""} onChange={e => setGuiConfig({ ...guiConfig, screenPackage: e.target.value })} placeholder={`com.${guiConfig.modId}.client.gui`} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] w-full outline-none font-mono text-zinc-300 placeholder:text-zinc-600" />

          <label className="text-xs mt-1">In-Game Title:</label>
          <input type="text" value={guiConfig.guiTitle} onChange={e => setGuiConfig({ ...guiConfig, guiTitle: e.target.value })} className="bg-zinc-950 p-1 rounded border border-zinc-700 text-sm w-full outline-none" />

          <div className="grid grid-cols-2 gap-2 mt-1 border-t border-zinc-800 pt-2">
            <div>
              <label className="text-[10px] text-zinc-400">GUI Width (px):</label>
              <input type="number" value={guiConfig.bgWidth} onChange={e => setGuiConfig({ ...guiConfig, bgWidth: parseInt(e.target.value, 10) || 0 })} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-emerald-300" />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400">GUI Height (px):</label>
              <input type="number" value={guiConfig.bgHeight} onChange={e => setGuiConfig({ ...guiConfig, bgHeight: parseInt(e.target.value, 10) || 0 })} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-emerald-300" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700 flex-shrink-0">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Asset Manager</span>
          <label className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-1.5 px-2 rounded text-xs text-center cursor-pointer transition w-full">
            Load Assets Folder
            <input type="file" webkitdirectory="true" directory="true" onChange={handleAssetsFolderImport} className="hidden" />
          </label>
          {loadedAssets.length > 0 && <span className="text-[10px] text-emerald-400 font-mono text-center">{loadedAssets.length} textures linked</span>}
        </div>

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

        <div className="flex flex-col gap-1.5 pt-4 border-t border-zinc-700 flex-shrink-0">
          <button onClick={handleDownloadJava} className="bg-emerald-600 hover:bg-emerald-500 font-bold py-2 px-3 rounded text-xs transition w-full">Export NeoForge (.java)</button>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={handleDownloadJson} className="bg-blue-600 hover:bg-blue-500 font-semibold py-1.5 px-2 rounded text-[11px] transition">Save Project</button>
            <button onClick={() => fileInputRef.current.click()} className="bg-zinc-700 hover:bg-zinc-600 font-semibold py-1.5 px-2 rounded text-[11px] transition">Load Project</button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleJsonImport} accept=".json" className="hidden" />
        </div>
      </div>

      {/* 2. THE WORKSPACE CANVAS */}
      <div
        ref={workspaceRef}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
        className="bg-zinc-950 select-none"
        onMouseDown={handleWorkspaceMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onWheel={handleWorkspaceWheel}
      >
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-1">
          <div className="flex items-center gap-1 bg-zinc-800/80 backdrop-blur border border-zinc-700 p-1 rounded shadow-lg">
            <button onClick={() => setScale(s => Math.max(0.2, s - 0.2))} className="w-6 h-6 flex items-center justify-center hover:bg-zinc-600 rounded text-zinc-300 font-bold">-</button>
            <span className="text-[10px] w-12 text-center font-mono text-zinc-300">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(5, s + 0.2))} className="w-6 h-6 flex items-center justify-center hover:bg-zinc-600 rounded text-zinc-300 font-bold">+</button>
            <button onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }} className="px-2 h-6 flex items-center justify-center hover:bg-zinc-600 rounded text-[10px] text-zinc-300 border-l border-zinc-700 ml-1">Reset</button>
          </div>
          
          <div className="flex items-center gap-2 bg-zinc-800/80 backdrop-blur border border-zinc-700 p-1.5 px-2 rounded shadow-lg mt-1">
            <label className="flex items-center gap-2 text-[10px] text-zinc-300 cursor-pointer select-none">
              <input type="checkbox" checked={snapEnabled} onChange={(e) => setSnapEnabled(e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" />
              Snap to Grid
            </label>
            {snapEnabled && (
              <select value={snapSize} onChange={(e) => setSnapSize(parseInt(e.target.value, 10))} className="bg-zinc-950 border border-zinc-700 text-[10px] rounded text-emerald-300 outline-none font-mono py-0.5">
                <option value="2">2px</option>
                <option value="4">4px</option>
                <option value="8">8px</option>
              </select>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-md border border-zinc-800 backdrop-blur-sm pointer-events-none z-50 shadow-lg leading-tight">
          <span className="font-bold text-zinc-300">Controls:</span><br />
          • Drag & Drop to add items<br />
          • Right-Click to inspect properties<br />
          • Ctrl + Scroll to Zoom In/Out<br />
          • Middle Click (or Alt+Click) to Pan
        </div>

        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <div
            style={{
              width: `${guiConfig.bgWidth}px`,
              height: `${guiConfig.bgHeight}px`,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            className="bg-zinc-800 border-2 border-zinc-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-visible"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleCanvasDrop(e, null)}
          >
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

            <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-red-500 z-50 pointer-events-none" title="Point 0,0" />

            {rootComponents.map((comp) => {
              // The ScrollPanel handles rendering its own children in WidgetRegistry now,
              // but we need to pass the render function results to it.
              return renderComponentElement(comp);
            })}
          </div>
        </div>
      </div>

      {/* 3. PROPERTIES INSPECTOR */}
      <div className="z-50 relative">
        <PropertiesInspector
          selectedComponent={selectedComponent} updateSelectedComponent={updateSelectedComponent} onDelete={handleDeleteComponent}
          loadedAssets={loadedAssets} guiConfig={guiConfig} setGuiConfig={setGuiConfig}
          moveComponentUp={moveComponentUp} moveComponentDown={moveComponentDown}
        />
      </div>

    </div>
  );
}