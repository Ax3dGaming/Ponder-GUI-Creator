export const ImageButtonGenerator = {
  generateJava: (comp, { getButtonActionCode, guiConfig }) => {
    const fields = [`    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`];
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    let texNormalStr = "";
    let texHoverStr = "";
    const initCode = [];

    if (comp.isUrl) {
        if (comp.texture) {
            texNormalStr = `net.minecraft.resources.ResourceLocation.parse("${guiConfig.modId}:url_imagebtn_${comp.id}_normal")`;
            initCode.push(`        net.minecraft.client.Minecraft.getInstance().getTextureManager().register(${texNormalStr}, new net.minecraft.client.renderer.texture.HttpTexture(null, "${comp.texture}", net.minecraft.resources.ResourceLocation.parse("minecraft:textures/gui/container/inventory.png"), false, null));`);
        }
        if (comp.textureHover) {
            texHoverStr = `net.minecraft.resources.ResourceLocation.parse("${guiConfig.modId}:url_imagebtn_${comp.id}_hover")`;
            initCode.push(`        net.minecraft.client.Minecraft.getInstance().getTextureManager().register(${texHoverStr}, new net.minecraft.client.renderer.texture.HttpTexture(null, "${comp.textureHover}", net.minecraft.resources.ResourceLocation.parse("minecraft:textures/gui/container/inventory.png"), false, null));`);
        }
    } else {
        if (comp.texture) {
            texNormalStr = `net.minecraft.resources.ResourceLocation.parse("${comp.texture}")`;
        }
        if (comp.textureHover) {
            texHoverStr = `net.minecraft.resources.ResourceLocation.parse("${comp.textureHover}")`;
        }
    }

    if (!texNormalStr) texNormalStr = `net.minecraft.resources.ResourceLocation.parse("pondertestgui:textures/gui/widgets.png")`;

    let renderLogic = `
        new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {
            @Override
            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {
                boolean hovered = mouseX >= this.getX() && mouseX <= this.getX() + this.width && mouseY >= this.getY() && mouseY <= this.getY() + this.height;
                net.minecraft.resources.ResourceLocation tex = ${texNormalStr};
                ${texHoverStr ? `if (hovered && this.active) { tex = ${texHoverStr}; }` : `if (hovered && this.active) { guiGraphics.setColor(0.8F, 0.8F, 0.8F, 1.0F); }`}

                guiGraphics.blit(tex, this.getX(), this.getY(), 0, 0, this.width, this.height, this.width, this.height);
                ${texHoverStr ? '' : `if (hovered && this.active) { guiGraphics.setColor(1.0F, 1.0F, 1.0F, 1.0F); }`}
            }

            @Override
            public boolean mouseClicked(double mouseX, double mouseY, int button) {
                if (this.active && this.visible && this.clicked(mouseX, mouseY)) {
                    ${getButtonActionCode(comp)}
                    return true;
                }
                return false;
            }

            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}
        }
    `;

    const scrollChildrenCode = [];
    
    if (comp.parentId) {
      scrollChildrenCode.push(`        this.${comp.id} = ${renderLogic.trim()};`);
      scrollChildrenCode.push(`        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
      initCode.push(`        this.${comp.id} = ${renderLogic.trim()};`);
      initCode.push(`        this.addRenderableWidget(this.${comp.id});`);
    }
    
    return { fields, initCode, renderBgCode: [], scrollChildrenCode };
  }
};
