export const HoverAreaGenerator = {
  generateJava: (comp, { getTextComponent }) => {
    const fields = [`    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`];
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    const componentInitString = `new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {\n` +
    `            @Override\n` +
    `            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {}\n` +
    `            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}\n` +
    `        }`;
    
    const tooltipSetter = `        this.${comp.id}.setTooltip(net.minecraft.client.gui.components.Tooltip.create(${getTextComponent(comp)}));`;
    
    const initCode = [];
    const scrollChildrenCode = [];
    
    if (comp.parentId) {
        scrollChildrenCode.push(`        this.${comp.id} = ${componentInitString};\n${tooltipSetter}\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
        initCode.push(`        // Hover Tooltip Area: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n${tooltipSetter}\n        this.addRenderableWidget(this.${comp.id});`);
    }
    
    return { fields, initCode, renderBgCode: [], scrollChildrenCode };
  }
};
