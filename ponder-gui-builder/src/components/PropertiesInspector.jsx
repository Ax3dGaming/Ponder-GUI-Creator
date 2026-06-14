import React from 'react';

export default function PropertiesInspector({ 
  selectedComponent, 
  updateSelectedComponent, 
  onDelete, 
  loadedAssets = [], 
  guiConfig, 
  setGuiConfig 
}) {
  return (
    <div className="w-64 bg-zinc-800 p-4 border-l border-zinc-700 flex flex-col gap-4 overflow-y-auto h-full">
      <h3 className="text-md font-bold text-zinc-300">Properties</h3>
      
      {/* ========================================================= */}
      {/* SECTION CONFIGURATION DU SCREEN GLOBAL                    */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-2 bg-zinc-900 p-3 rounded border border-zinc-700">
        <span className="text-xs font-semibold text-zinc-400 uppercase">Screen Background</span>
        <select 
          value={guiConfig.backgroundType} 
          onChange={e => setGuiConfig({...guiConfig, backgroundType: e.target.value})} 
          className="bg-zinc-950 p-1.5 rounded border border-zinc-700 text-sm w-full outline-none"
        >
          <option value="VANILLA_DARK">Vanilla Dark Background</option>
          <option value="CONTAINER">Standard Container</option>
          <option value="CUSTOM">Custom Texture Asset</option>
        </select>

        {guiConfig.backgroundType === "CUSTOM" && (
          <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-zinc-800">
            <label className="text-xs text-zinc-400">Background Texture</label>
            {loadedAssets.length > 0 ? (
              <select
                value={guiConfig.customTexture || ''}
                onChange={(e) => setGuiConfig({...guiConfig, customTexture: e.target.value})}
                className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300"
              >
                <option value="">-- Select background --</option>
                {loadedAssets.map(asset => (
                  <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
                ))}
              </select>
            ) : (
              <input 
                type="text" 
                value={guiConfig.customTexture || ''} 
                onChange={(e) => setGuiConfig({...guiConfig, customTexture: e.target.value})} 
                className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-zinc-400" 
                placeholder="ponder:textures/gui/bg.png"
              />
            )}
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-[10px] text-zinc-400">File Texture Width:</label>
                <input 
                  type="number" 
                  value={guiConfig.textureWidth || 256} 
                  onChange={e => setGuiConfig({...guiConfig, textureWidth: parseInt(e.target.value, 10) || 256})} 
                  className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-amber-400" 
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400">File Texture Height:</label>
                <input 
                  type="number" 
                  value={guiConfig.textureHeight || 256} 
                  onChange={e => setGuiConfig({...guiConfig, textureHeight: parseInt(e.target.value, 10) || 256})} 
                  className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs text-center font-mono outline-none text-amber-400" 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* INSPECTION INDIVIDUELLE DES COMPOSANTS SÉLECTIONNÉS        */}
      {/* ========================================================= */}
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

          {/* PROPRIÉTÉ TEXTE : COMMUNE AUX BOUTONS ET AUX LABELS */}
          {(selectedComponent.type === 'Button' || selectedComponent.type === 'Label') && (
            <div>
              <label className="text-xs text-zinc-400">Display Text</label>
              <input 
                type="text" 
                value={selectedComponent.text} 
                onChange={(e) => updateSelectedComponent('text', e.target.value)} 
                className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-sans" 
              />
            </div>
          )}

          {/* PROPRIÉTÉ TEXTURE : COMMUNE AUX IMAGEBUTTONS, IMAGES STATIQUES ET L'INVENTAIRE JOUEUR */}
          {(selectedComponent.type === 'ImageButton' || selectedComponent.type === 'Image' || selectedComponent.type === 'PlayerInventory') && (
            <div>
              <label className="text-xs text-zinc-400">Texture Asset Location</label>
              {loadedAssets.length > 0 ? (
                <select
                  value={selectedComponent.texture || ''}
                  onChange={(e) => updateSelectedComponent('texture', e.target.value)}
                  className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300 mt-1"
                >
                  <option value="">-- Select a texture asset --</option>
                  {loadedAssets.map(asset => (
                    <option key={asset.minecraftPath} value={asset.minecraftPath}>{asset.minecraftPath}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type="text" 
                  value={selectedComponent.texture || ''} 
                  onChange={(e) => updateSelectedComponent('texture', e.target.value)} 
                  className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-zinc-300" 
                  placeholder="modid:textures/gui/widgets.png" 
                />
              )}
            </div>
          )}

          {/* PROPRIÉTÉ PLACEHOLDER : RÉSERVÉE AUX EDITBOXES */}
          {selectedComponent.type === 'EditBox' && (
            <div>
              <label className="text-xs text-zinc-400">Hint / Placeholder Text</label>
              <input 
                type="text" 
                value={selectedComponent.placeholder} 
                onChange={(e) => updateSelectedComponent('placeholder', e.target.value)} 
                className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white" 
              />
            </div>
          )}

          {/* POSITIONNEMENT GRILLE COMMUNE */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-400">X Position</label>
              <input type="number" value={selectedComponent.x} onChange={(e) => updateSelectedComponent('x', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-mono" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Y Position</label>
              <input type="number" value={selectedComponent.y} onChange={(e) => updateSelectedComponent('y', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none text-white font-mono" />
            </div>
          </div>

          {/* TAILLE ET DIMENSIONS COMMUNES */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-400">Width (Largeur)</label>
              <input type="number" value={selectedComponent.width} disabled={selectedComponent.type === 'PlayerInventory'} onChange={(e) => updateSelectedComponent('width', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none disabled:opacity-40 text-white font-mono" />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Height (Hauteur)</label>
              <input type="number" value={selectedComponent.height} disabled={selectedComponent.type === 'PlayerInventory'} onChange={(e) => updateSelectedComponent('height', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none disabled:opacity-40 text-white font-mono" />
            </div>
          </div>

          {/* COULEUR EN HEXADÉCIMAL : EXCLUSIF AUX LABELS */}
          {selectedComponent.type === 'Label' && (
            <div>
              <label className="text-xs text-zinc-400">Color (Java Hex)</label>
              <input 
                type="text" 
                value={selectedComponent.color} 
                onChange={(e) => updateSelectedComponent('color', e.target.value)} 
                className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-700 text-sm mt-1 text-emerald-300 outline-none font-mono" 
                placeholder="0xFFFFFF"
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* COMPOSANT SPÉCIFIQUE : SCROLLPANEL                        */}
          {/* ========================================================= */}
          {selectedComponent.type === 'ScrollPanel' && (
            <div className="flex flex-col gap-3 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Scroll Container Settings</span>
              
              <button
                type="button"
                onClick={() => {
                  const widgetCode = `package ${selectedComponent.widgetPackage || 'com.' + guiConfig.modId + '.client.gui.components'};\n\n` +
                  `import net.minecraft.client.Minecraft;\n` +
                  `import net.neoforged.api.distmarker.Dist;\n` +
                  `import net.neoforged.api.distmarker.OnlyIn;\n` +
                  `import net.minecraft.client.gui.GuiGraphics;\n` +
                  `import net.minecraft.client.gui.components.AbstractWidget;\n` +
                  `import net.minecraft.client.gui.components.Renderable;\n` +
                  `import net.minecraft.client.gui.components.events.GuiEventListener;\n` +
                  `import net.minecraft.client.gui.narration.NarrationElementOutput;\n` +
                  `import net.minecraft.network.chat.Component;\n` +
                  `import net.minecraft.resources.ResourceLocation;\n` +
                  `import java.util.ArrayList;\n` +
                  `import java.util.List;\n\n` +
                  `@OnlyIn(Dist.CLIENT)\n` +
                  `public class ScrollPanelWidget extends AbstractWidget implements Renderable, GuiEventListener {\n` +
                  `    private final List<AbstractWidget> children = new ArrayList<>();\n` +
                  `    private final int maxContentHeight;\n` +
                  `    private final int maxContentWidth;\n` +
                  `    private final boolean allowXScroll;\n` +
                  `    private final boolean allowYScroll;\n` +
                  `    private final boolean showBorder;\n` +
                  `    private final int borderColor;\n` +
                  `    private double scrollAmountX = 0;\n` +
                  `    private double scrollAmountY = 0;\n` +
                  `    private double targetScrollX = 0;\n` +
                  `    private double targetScrollY = 0;\n` +
                  `    private boolean isDraggingY = false;\n` +
                  `    private boolean isDraggingX = false;\n` +
                  `    private GuiEventListener focusedChild = null;\n\n` +
                  `    private ResourceLocation vBarTex = null;\n` +
                  `    private ResourceLocation vThumbTex = null;\n` +
                  `    private ResourceLocation hBarTex = null;\n` +
                  `    private ResourceLocation hThumbTex = null;\n\n` +
                  `    public ScrollPanelWidget(int x, int y, int width, int height, int maxContentWidth, int maxContentHeight, boolean allowXScroll, boolean allowYScroll, boolean showBorder, int borderColor) {\n` +
                  `        super(x, y, width, height, Component.empty());\n` +
                  `        this.maxContentWidth = maxContentWidth;\n` +
                  `        this.maxContentHeight = maxContentHeight;\n` +
                  `        this.allowXScroll = allowXScroll;\n` +
                  `        this.allowYScroll = allowYScroll;\n` +
                  `        this.showBorder = showBorder;\n` +
                  `        this.borderColor = borderColor;\n` +
                  `    }\n\n` +
                  `    public void setVerticalScrollTextures(String bar, String thumb) {\n` +
                  `        if (!bar.isEmpty()) this.vBarTex = ResourceLocation.parse(bar);\n` +
                  `        if (!thumb.isEmpty()) this.vThumbTex = ResourceLocation.parse(thumb);\n` +
                  `    }\n\n` +
                  `    public void setHorizontalScrollTextures(String bar, String thumb) {\n` +
                  `        if (!bar.isEmpty()) this.hBarTex = ResourceLocation.parse(bar);\n` +
                  `        if (!thumb.isEmpty()) this.hThumbTex = ResourceLocation.parse(thumb);\n` +
                  `    }\n\n` +
                  `    public void addWidget(AbstractWidget widget) { this.children.add(widget); }\n\n` +
                  `    @Override\n` +
                  `    public void renderWidget(GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {\n` +
                  `        if (this.allowYScroll) {\n` +
                  `            this.scrollAmountY += (this.targetScrollY - this.scrollAmountY) * 0.25f;\n` +
                  `            if (Math.abs(this.scrollAmountY - this.targetScrollY) < 0.05) this.scrollAmountY = this.targetScrollY;\n` +
                  `        }\n` +
                  `        if (this.allowXScroll) {\n` +
                  `            this.scrollAmountX += (this.targetScrollX - this.scrollAmountX) * 0.25f;\n` +
                  `            if (Math.abs(this.scrollAmountX - this.targetScrollX) < 0.05) this.scrollAmountX = this.targetScrollX;\n` +
                  `        }\n\n` +
                  `        if (this.showBorder) {\n` +
                  `            guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height, 0x400F172A);\n` +
                  `            guiGraphics.renderOutline(this.getX(), this.getY(), this.width, this.height, this.borderColor);\n` +
                  `        }\n\n` +
                  `        this.handleDragLogic(mouseX, mouseY);\n` +
                  `        this.renderScrollBars(guiGraphics);\n\n` +
                  `        if (this.width > 0 && this.height > 0) {\n` +
                  `            guiGraphics.enableScissor(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height);\n` +
                  `            guiGraphics.pose().pushPose();\n` +
                  `            guiGraphics.pose().translate(0, 0, 1.0f);\n\n` +
                  `            for (AbstractWidget widget : children) {\n` +
                  `                int relativeX = widget.getX();\n` +
                  `                int relativeY = widget.getY();\n` +
                  `                int absoluteX = (int) (this.getX() + relativeX - this.scrollAmountX);\n` +
                  `                int absoluteY = (int) (this.getY() + relativeY - this.scrollAmountY);\n\n` +
                  `                widget.setX(absoluteX);\n` +
                  `                widget.setY(absoluteY);\n` +
                  `                widget.render(guiGraphics, mouseX, mouseY, partialTick);\n\n` +
                  `                widget.setX(relativeX);\n` +
                  `                widget.setY(relativeY);\n` +
                  `            }\n` +
                  `            guiGraphics.pose().popPose();\n` +
                  `            guiGraphics.disableScissor();\n` +
                  `        }\n` +
                  `    }\n\n` +
                  `    private void renderScrollBars(GuiGraphics graphics) {\n` +
                  `        if (this.allowYScroll && this.maxContentHeight > this.height && this.vBarTex != null && this.vThumbTex != null) {\n` +
                  `            int barX = this.getX() + this.width - 10; int barY = this.getY(); int barW = 8; int barH = this.height;\n` +
                  `            graphics.blit(this.vBarTex, barX, barY, 0, 0, barW, barH, barW, barH);\n` +
                  `            double progressY = this.scrollAmountY / (this.maxContentHeight - this.height);\n` +
                  `            int thumbH = Math.max(15, (int)((double)this.height * this.height / this.maxContentHeight));\n` +
                  `            int thumbY = barY + (int)(progressY * (this.height - thumbH));\n` +
                  `            graphics.blit(this.vThumbTex, barX, thumbY, 0, 0, barW, thumbH, barW, thumbH);\n` +
                  `        }\n` +
                  `        if (this.allowXScroll && this.maxContentWidth > this.width && this.hBarTex != null && this.hThumbTex != null) {\n` +
                  `            int barX = this.getX(); int barY = this.getY() + this.height - 10; int barW = this.width; int barH = 8;\n` +
                  `            graphics.blit(this.hBarTex, barX, barY, 0, 0, barW, barH, barW, barH);\n` +
                  `            double progressX = this.scrollAmountX / (this.maxContentWidth - this.width);\n` +
                  `            int thumbW = Math.max(15, (int)((double)this.width * this.width / this.maxContentWidth));\n` +
                  `            int thumbX = barX + (int)(progressX * (this.width - thumbW));\n` +
                  `            graphics.blit(this.hThumbTex, thumbX, barY, 0, 0, thumbW, barH, thumbW, barH);\n` +
                  `        }\n` +
                  `    }\n\n` +
                  `    private void handleDragLogic(double mouseX, double mouseY) {\n` +
                  `        if (this.isDraggingY) {\n` +
                  `            int thumbH = Math.max(15, (int)((double)this.height * this.height / this.maxContentHeight));\n` +
                  `            double delta = (mouseY - this.getY() - (thumbH / 2.0)) / (this.height - thumbH);\n` +
                  `            this.targetScrollY = Math.max(0, Math.min(delta * (this.maxContentHeight - this.height), this.maxContentHeight - this.height));\n` +
                  `            this.scrollAmountY = this.targetScrollY;\n` +
                  `        }\n` +
                  `        if (this.isDraggingX) {\n` +
                  `            int thumbW = Math.max(15, (int)((double)this.width * this.width / this.maxContentWidth));\n` +
                  `            double delta = (mouseX - this.getX() - (thumbW / 2.0)) / (this.width - thumbW);\n` +
                  `            this.targetScrollX = Math.max(0, Math.min(delta * (this.maxContentWidth - this.width), this.maxContentWidth - this.width));\n` +
                  `            this.scrollAmountX = this.targetScrollX;\n` +
                  `        }\n` +
                  `    }\n\n` +
                  `    @Override\n` +
                  `    public boolean mouseScrolled(double mouseX, double mouseY, double scrollX, double scrollY) {\n` +
                  `        if (this.isMouseOver(mouseX, mouseY)) {\n` +
                  `            if (this.allowYScroll && this.maxContentHeight > this.height) {\n` +
                  `                this.targetScrollY = Math.max(0, Math.min(this.targetScrollY - (scrollY * 16), this.maxContentHeight - this.height));\n` +
                  `                return true;\n` +
                  `            }\n` +
                  `            if (this.allowXScroll && this.maxContentWidth > this.width) {\n` +
                  `                double activeScroll = scrollY != 0 ? scrollY : scrollX;\n` +
                  `                this.targetScrollX = Math.max(0, Math.min(this.targetScrollX - (activeScroll * 16), this.maxContentWidth - this.width));\n` +
                  `                return true;\n` +
                  `            }\n` +
                  `        }\n` +
                  `        return false;\n` +
                  `    }\n\n` +
                  `    @Override\n` +
                  `    public boolean mouseClicked(double mouseX, double mouseY, int button) {\n` +
                  `        if (button == 0 && this.allowYScroll && mouseX >= this.getX() + this.width - 10 && mouseX <= this.getX() + this.width && mouseY >= this.getY() && mouseY <= this.getY() + this.height) {\n` +
                  `            this.isDraggingY = true; return true;\n` +
                  `        }\n` +
                  `        if (button == 0 && this.allowXScroll && mouseX >= this.getX() && mouseX <= this.getX() + this.width && mouseY >= this.getY() + this.height - 10 && mouseY <= this.getY() + this.height) {\n` +
                  `            this.isDraggingX = true; return true;\n` +
                  `        }\n` +
                  `        if (this.isMouseOver(mouseX, mouseY)) {\n` +
                  `            for (AbstractWidget widget : children) {\n` +
                  `                int relativeX = widget.getX();\n` +
                  `                int relativeY = widget.getY();\n` +
                  `                widget.setX((int) (this.getX() + relativeX - this.scrollAmountX));\n` +
                  `                widget.setY((int) (this.getY() + relativeY - this.scrollAmountY));\n\n` +
                  `                if (widget.mouseClicked(mouseX, mouseY, button)) {\n` +
                  `                    this.focusedChild = widget;\n` +
                  `                    widget.setX(relativeX);\n` +
                  `                    widget.setY(relativeY);\n` +
                  `                    return true;\n` +
                  `                }\n` +
                  `                widget.setX(relativeX);\n` +
                  `                widget.setY(relativeY);\n` +
                  `            }\n` +
                  `        }\n` +
                  `        return false;\n` +
                  `    }\n\n` +
                  `    @Override\n` +
                  `    public boolean mouseDragged(double mouseX, double mouseY, int button, double dragX, double dragY) {\n` +
                  `        if (this.isDraggingY || this.isDraggingX) { this.handleDragLogic(mouseX, mouseY); return true; }\n` +
                  `        if (this.focusedChild != null && this.focusedChild instanceof AbstractWidget widget) {\n` +
                  `            int relativeX = widget.getX(); int relativeY = widget.getY();\n` +
                  `            widget.setX((int) (this.getX() + relativeX - this.scrollAmountX));\n` +
                  `            widget.setY((int) (this.getY() + relativeY - this.scrollAmountY));\n` +
                  `            if (widget.mouseDragged(mouseX, mouseY, button, dragX, dragY)) {\n` +
                  `                widget.setX(relativeX); widget.setY(relativeY); return true;\n            }\n` +
                  `            widget.setX(relativeX); widget.setY(relativeY);\n` +
                  `        }\n` +
                  `        return false;\n` +
                  `    }\n\n` +
                  `    @Override\n` +
                  `    public boolean mouseReleased(double mouseX, double mouseY, int button) {\n` +
                  `        if (button == 0) { this.isDraggingY = false; this.isDraggingX = false;\n            if (this.focusedChild != null) { this.focusedChild.mouseReleased(mouseX, mouseY, button); this.focusedChild = null; }\n        }\n        return super.mouseReleased(mouseX, mouseY, button);\n    }\n\n` +
                  `    @Override protected void updateWidgetNarration(NarrationElementOutput output) {}\n` +
                  `}`;

                  const blob = new Blob([widgetCode], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'ScrollPanelWidget.java';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-2 rounded text-xs transition text-center shadow"
              >
                📥 Download ScrollPanelWidget.java
              </button>

              <div className="mt-1">
                <label className="w-full text-[11px] text-zinc-400">Widget Package Path</label>
                <input type="text" value={selectedComponent.widgetPackage || `com.${guiConfig.modId}.client.gui.components`} onChange={(e) => updateSelectedComponent('widgetPackage', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-amber-400" />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400">Max Content Dynamic Length (px)</label>
                <input type="number" value={selectedComponent.maxScrollDistance || 600} onChange={(e) => updateSelectedComponent('maxScrollDistance', parseInt(e.target.value, 10) || 0)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-emerald-300" />
              </div>

              {/* SÉLECTEUR D'AXE AVEC LE COMPORTEMENT DE SWITCH SÉCURISÉ === true */}
              <div>
                <label className="text-[11px] text-zinc-400">Scroll Orientation</label>
                <select
                  value={selectedComponent.scrollX === true ? 'HORIZONTAL' : 'VERTICAL'}
                  onChange={(e) => {
                    const isHoriz = e.target.value === 'HORIZONTAL';
                    if (isHoriz) {
                      updateSelectedComponent('scrollX', true);
                      updateSelectedComponent('scrollY', false);
                      updateSelectedComponent('vTrackTex', '');
                      updateSelectedComponent('vThumbTex', '');
                    } else {
                      updateSelectedComponent('scrollX', false);
                      updateSelectedComponent('scrollY', true);
                      updateSelectedComponent('hTrackTex', '');
                      updateSelectedComponent('hThumbTex', '');
                    }
                  }}
                  className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-emerald-400 cursor-pointer"
                >
                  <option value="VERTICAL">↕ Vertical Only</option>
                  <option value="HORIZONTAL">↔ Horizontal Only</option>
                </select>
              </div>

              <div className="border-t border-zinc-800 pt-2 flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input type="checkbox" checked={selectedComponent.showBorder !== false} onChange={(e) => updateSelectedComponent('showBorder', e.target.checked)} className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500"/>
                  Enable Outline Border
                </label>
                {selectedComponent.showBorder !== false && (
                  <div>
                    <label className="text-[11px] text-zinc-400">Border ARGB Color</label>
                    <input type="text" value={selectedComponent.borderColor || "0x803B82F6"} onChange={(e) => updateSelectedComponent('borderColor', e.target.value)} className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-amber-400" />
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-800 pt-1 flex flex-col gap-2">
                {(selectedComponent.scrollY !== false) ? (
                  <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800 flex flex-col gap-1.5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Vertical Layout Textures</span>
                    <label className="text-[10px] text-zinc-400">Track:</label>
                    <select value={selectedComponent.vTrackTex || ''} onChange={(e) => updateSelectedComponent('vTrackTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-amber-400">
                      <option value="">-- Choose Asset Texture --</option>
                      {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
                    </select>
                    <label className="text-[10px] text-zinc-400">Thumb (Puce):</label>
                    <select value={selectedComponent.vThumbTex || ''} onChange={(e) => updateSelectedComponent('vThumbTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-amber-400">
                      <option value="">-- Choose Asset Texture --</option>
                      {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800 flex flex-col gap-1.5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Horizontal Layout Textures</span>
                    <label className="text-[10px] text-zinc-400">Track:</label>
                    <select value={selectedComponent.hTrackTex || ''} onChange={(e) => updateSelectedComponent('hTrackTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-emerald-400">
                      <option value="">-- Choose Asset Texture --</option>
                      {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
                    </select>
                    <label className="text-[10px] text-zinc-400">Thumb (Puce):</label>
                    <select value={selectedComponent.hThumbTex || ''} onChange={(e) => updateSelectedComponent('hThumbTex', e.target.value)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-[10px] outline-none font-mono text-emerald-400">
                      <option value="">-- Choose Asset Texture --</option>
                      {loadedAssets.map(a => <option key={a.minecraftPath} value={a.minecraftPath}>{a.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* COMPOSANT SPÉCIFIQUE : SLIDER AVEC OPTIONS COMPLÈTES      */}
          {/* ========================================================= */}
          {selectedComponent.type === 'Slider' && (
            <div className="flex flex-col gap-2 bg-zinc-900 p-2.5 rounded border border-zinc-700 mt-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Slider Settings</span>
              
              <div>
                <label className="text-xs text-zinc-400">Slider Display Title</label>
                <input 
                  type="text" 
                  value={selectedComponent.text || "Slider"} 
                  onChange={(e) => updateSelectedComponent('text', e.target.value)} 
                  className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-sm mt-1 outline-none font-sans text-white" 
                />
              </div>

              <div className="mt-1 flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={selectedComponent.isTextPrefix !== false} 
                    onChange={(e) => updateSelectedComponent('isTextPrefix', e.target.checked)} 
                    className="rounded bg-zinc-950 border-zinc-700 accent-emerald-500" 
                  />
                  Text acts as a Prefix (Append value)
                </label>
              </div>

              {selectedComponent.isTextPrefix !== false && (
                <div className="mt-1">
                  <label className="text-xs text-zinc-400">Value Float Precision</label>
                  <select 
                    value={selectedComponent.formatNumber || 'x'} 
                    onChange={(e) => updateSelectedComponent('formatNumber', e.target.value)} 
                    className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-700 text-xs mt-1 outline-none font-mono text-emerald-400" 
                  >
                    <option value="x">x (Integer: 10)</option>
                    <option value="x.x">x.x (1 Decimal: 10.5)</option>
                    <option value="x.xx">x.xx (2 Decimals: 10.55)</option>
                    <option value="x.xxx">x.xxx (3 Decimals: 10.555)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-1 mt-2 border-t border-zinc-800 pt-2">
                <div>
                  <label className="text-[10px] text-zinc-400">Min</label>
                  <input type="number" value={selectedComponent.minVal} onChange={(e) => updateSelectedComponent('minVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400">Max</label>
                  <input type="number" value={selectedComponent.maxVal} onChange={(e) => updateSelectedComponent('maxVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400">Default</label>
                  <input type="number" value={selectedComponent.currentVal} onChange={(e) => updateSelectedComponent('currentVal', parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 p-1 rounded border border-zinc-700 text-xs outline-none font-mono text-emerald-300" />
                </div>
              </div>
            </div>
          )}
          
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