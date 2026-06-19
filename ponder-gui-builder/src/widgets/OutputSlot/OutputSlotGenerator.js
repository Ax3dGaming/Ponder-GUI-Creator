export const OutputSlotGenerator = {
  generateJava: (comp, context) => {
    let renderBgCode = [];
    if (comp.ghostIcon && context && context.slotIndexMap !== undefined) {
      const slotIndex = context.slotIndexMap[comp.id];
      const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
      const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
      const res = `net.minecraft.resources.ResourceLocation.parse("${comp.ghostIcon}")`;
      
      renderBgCode.push(`        if (!this.menu.slots.get(${slotIndex}).hasItem()) {`);
      renderBgCode.push(`            net.minecraft.client.renderer.RenderSystem.enableBlend();`);
      renderBgCode.push(`            guiGraphics.blit(${res}, ${posX}, ${posY}, 0, 0, 16, 16, 16, 16);`);
      renderBgCode.push(`            net.minecraft.client.renderer.RenderSystem.disableBlend();`);
      renderBgCode.push(`        }`);
    }

    return {
      fields: [],
      initCode: [`        // Slot output: ${comp.id} registered via Menu at relative X: ${comp.x}, Y: ${comp.y}`],
      renderBgCode,
      scrollChildrenCode: []
    };
  }
};
