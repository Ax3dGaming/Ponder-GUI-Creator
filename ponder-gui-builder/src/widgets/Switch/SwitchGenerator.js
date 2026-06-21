export const SwitchGenerator = {
  generateJava: (comp, { getButtonActionCode }) => {
    const fields = [
      `    public boolean isToggled_${comp.id} = ${comp.defaultState ? 'true' : 'false'};`,
      `    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`
    ];
    
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    let renderLogic = `
        new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {
            @Override
            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {
                String texOn = "${comp.textureOn || ''}";
                String texOff = "${comp.textureOff || ''}";

                if (isToggled_${comp.id}) {
                    if (!texOn.isEmpty()) {
                        guiGraphics.blit(net.minecraft.resources.ResourceLocation.parse(texOn), this.getX(), this.getY(), 0, 0, this.width, this.height, this.width, this.height);
                    } else {
                        guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height, 0xFF22C55E); // Green
                        guiGraphics.renderOutline(this.getX(), this.getY(), this.width, this.height, 0xFF166534);
                    }
                } else {
                    if (!texOff.isEmpty()) {
                        guiGraphics.blit(net.minecraft.resources.ResourceLocation.parse(texOff), this.getX(), this.getY(), 0, 0, this.width, this.height, this.width, this.height);
                    } else {
                        guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height, 0xFF3F3F46); // Gray
                        guiGraphics.renderOutline(this.getX(), this.getY(), this.width, this.height, 0xFF52525B);
                    }
                }
            }

            @Override
            public boolean mouseClicked(double mouseX, double mouseY, int button) {
                if (this.active && this.visible && this.clicked(mouseX, mouseY)) {
                    isToggled_${comp.id} = !isToggled_${comp.id};
                    net.minecraft.client.Minecraft.getInstance().getSoundManager().play(net.minecraft.client.resources.sounds.SimpleSoundInstance.forUI(net.minecraft.sounds.SoundEvents.UI_BUTTON_CLICK, 1.0F));
                    ${getButtonActionCode(comp)}
                    return true;
                }
                return false;
            }

            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}
        }
    `;

    const initCode = [];
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
