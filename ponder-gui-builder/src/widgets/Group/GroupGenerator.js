export const GroupGenerator = {
  generateJava: (comp) => {
    const fields = [`    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`];
    const initCode = [];
    const renderBgCode = [];
    const scrollChildrenCode = [];

    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;

    let renderLogic = `
        new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {
            @Override
            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {
                // Groups render nothing by default, they just hold children if they are implemented as widgets
                // However, our generator handles children absolutely positioned relative to the screen usually,
                // BUT for ScrollPanel we need a widget wrapper.
                // Since this is a Group inside a ScrollPanel, we just need it to exist so children can be offset.
                // Note: The generator usually flattens groups by translating coordinates directly in the Java loops, 
                // but if we wrap it in a Widget, we can just return it.
            }

            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}
        }
    `;

    // Wait, if it's just a grouping for the editor, we don't necessarily need a Java widget for it, 
    // EXCEPT if it's inside a ScrollPanel, it helps to group things. 
    // Actually, generating a dummy widget is perfectly fine.
    
    if (comp.parentId) {
        scrollChildrenCode.push(`        this.${comp.id} = ${renderLogic.trim()};`);
        scrollChildrenCode.push(`        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
        initCode.push(`        this.${comp.id} = ${renderLogic.trim()};`);
        // We do NOT add it to renderable widgets if it has no background, 
        // but adding it doesn't hurt and allows it to process events if we ever add them.
        initCode.push(`        this.addRenderableWidget(this.${comp.id});`);
    }

    return { fields, initCode, renderBgCode, scrollChildrenCode };
  }
};
