export const DropdownGenerator = {
  generateJava: (comp) => {
    const fields = [`    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`];
    const initCode = [];
    const renderBgCode = [];
    const scrollChildrenCode = [];

    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;

    const optsString = (comp.options || []).map(opt => `"${opt.replace(/"/g, '\\"')}"`).join(', ');

    let renderLogic = `
        new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {
            private boolean isOpen = false;
            private int selectedIndex = ${comp.selectedIndex || 0};
            private final String[] options = new String[]{ ${optsString} };

            public String getSelectedOption() {
                if (selectedIndex >= 0 && selectedIndex < options.length) return options[selectedIndex];
                return "";
            }

            @Override
            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {
                // Main Button Background
                String btnTex = "${comp.buttonTexture || ''}";
                if (btnTex.isEmpty()) {
                    guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height, 0xFF3F3F46);
                    guiGraphics.renderOutline(this.getX(), this.getY(), this.width, this.height, 0xFF52525B);
                } else {
                    guiGraphics.blit(net.minecraft.resources.ResourceLocation.parse(btnTex), this.getX(), this.getY(), 0, 0, this.width, this.height, this.width, this.height);
                }
                
                String display = options.length > 0 ? options[Math.min(selectedIndex, options.length - 1)] : "";
                guiGraphics.drawString(net.minecraft.client.Minecraft.getInstance().font, display, this.getX() + 4, this.getY() + (this.height - 8) / 2, 0xFFFFFF, false);
                guiGraphics.drawString(net.minecraft.client.Minecraft.getInstance().font, isOpen ? "▲" : "▼", this.getX() + this.width - 10, this.getY() + (this.height - 8) / 2, 0xAAAAAA, false);

                // Dropdown List
                if (isOpen) {
                    guiGraphics.pose().pushPose();
                    guiGraphics.pose().translate(0, 0, 400); // Bring to front
                    int listY = this.getY() + this.height;
                    String listTex = "${comp.listTexture || ''}";
                    if (listTex.isEmpty()) {
                        guiGraphics.fill(this.getX(), listY, this.getX() + this.width, listY + (options.length * 14), 0xFF27272A);
                        guiGraphics.renderOutline(this.getX(), listY, this.width, options.length * 14, 0xFF52525B);
                    } else {
                        guiGraphics.blit(net.minecraft.resources.ResourceLocation.parse(listTex), this.getX(), listY, 0, 0, this.width, options.length * 14, this.width, options.length * 14);
                    }
                    
                    for (int i = 0; i < options.length; i++) {
                        int itemY = listY + (i * 14);
                        boolean hovered = mouseX >= this.getX() && mouseX <= this.getX() + this.width && mouseY >= itemY && mouseY <= itemY + 14;
                        if (hovered) {
                            guiGraphics.fill(this.getX() + 1, itemY + 1, this.getX() + this.width - 1, itemY + 13, 0xFF3F3F46);
                        }
                        guiGraphics.drawString(net.minecraft.client.Minecraft.getInstance().font, options[i], this.getX() + 4, itemY + 3, hovered ? 0xFFFFFF : 0xAAAAAA, false);
                    }
                    guiGraphics.pose().popPose();
                }
            }

            @Override
            public boolean mouseClicked(double mouseX, double mouseY, int button) {
                if (this.active && this.visible) {
                    if (isOpen) {
                        int listY = this.getY() + this.height;
                        if (mouseX >= this.getX() && mouseX <= this.getX() + this.width && mouseY >= listY && mouseY <= listY + (options.length * 14)) {
                            int clickedIndex = (int) (mouseY - listY) / 14;
                            if (clickedIndex >= 0 && clickedIndex < options.length) {
                                this.selectedIndex = clickedIndex;
                                net.minecraft.client.Minecraft.getInstance().getSoundManager().play(net.minecraft.client.resources.sounds.SimpleSoundInstance.forUI(net.minecraft.sounds.SoundEvents.UI_BUTTON_CLICK, 1.0F));
                            }
                            this.isOpen = false;
                            return true;
                        }
                    }
                    
                    if (this.clicked(mouseX, mouseY)) {
                        this.isOpen = !this.isOpen;
                        net.minecraft.client.Minecraft.getInstance().getSoundManager().play(net.minecraft.client.resources.sounds.SimpleSoundInstance.forUI(net.minecraft.sounds.SoundEvents.UI_BUTTON_CLICK, 1.0F));
                        return true;
                    } else {
                        this.isOpen = false; // click outside
                    }
                }
                return false;
            }

            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}
        }
    `;

    if (comp.parentId) {
        scrollChildrenCode.push(`        this.${comp.id} = ${renderLogic.trim()};`);
        scrollChildrenCode.push(`        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
        initCode.push(`        this.${comp.id} = ${renderLogic.trim()};`);
        initCode.push(`        this.addRenderableWidget(this.${comp.id});`);
    }

    return { fields, initCode, renderBgCode, scrollChildrenCode };
  }
};
