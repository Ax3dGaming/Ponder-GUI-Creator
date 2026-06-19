export const ProgressBarGenerator = {
  generateJava: (comp) => {
    const fields = [`    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`, `    private float val_${comp.id} = ${comp.currentVal}f;`];
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    let componentInitString = `new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {\n` +
    `            private float min = ${comp.minVal}f;\n` +
    `            private float max = ${comp.maxVal}f;\n`;

    let fillLogicTex = "";
    let fillLogicSolid = "";
    
    if (comp.fillDirection === 'RTL') {
        fillLogicTex = `                int fgWidth = (int)(this.width * progress);\n` +
                       `                if (fgWidth > 0) guiGraphics.blit(fillTex, this.getX() + this.width - fgWidth, this.getY(), this.width - fgWidth, 0, fgWidth, this.height, this.width, this.height);\n`;
        fillLogicSolid = `                int fgWidth = (int)(this.width * progress);\n` +
                         `                if (fgWidth > 0) guiGraphics.fill(this.getX() + this.width - fgWidth, this.getY(), this.getX() + this.width, this.getY() + this.height, color);\n`;
    } else if (comp.fillDirection === 'TTB') {
        fillLogicTex = `                int fgHeight = (int)(this.height * progress);\n` +
                       `                if (fgHeight > 0) guiGraphics.blit(fillTex, this.getX(), this.getY(), 0, 0, this.width, fgHeight, this.width, this.height);\n`;
        fillLogicSolid = `                int fgHeight = (int)(this.height * progress);\n` +
                         `                if (fgHeight > 0) guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + fgHeight, color);\n`;
    } else if (comp.fillDirection === 'BTT') {
        fillLogicTex = `                int fgHeight = (int)(this.height * progress);\n` +
                       `                if (fgHeight > 0) guiGraphics.blit(fillTex, this.getX(), this.getY() + this.height - fgHeight, 0, this.height - fgHeight, this.width, fgHeight, this.width, this.height);\n`;
        fillLogicSolid = `                int fgHeight = (int)(this.height * progress);\n` +
                         `                if (fgHeight > 0) guiGraphics.fill(this.getX(), this.getY() + this.height - fgHeight, this.getX() + this.width, this.getY() + this.height, color);\n`;
    } else { // LTR
        fillLogicTex = `                int fgWidth = (int)(this.width * progress);\n` +
                       `                if (fgWidth > 0) guiGraphics.blit(fillTex, this.getX(), this.getY(), 0, 0, fgWidth, this.height, this.width, this.height);\n`;
        fillLogicSolid = `                int fgWidth = (int)(this.width * progress);\n` +
                         `                if (fgWidth > 0) guiGraphics.fill(this.getX(), this.getY(), this.getX() + fgWidth, this.getY() + this.height, color);\n`;
    }

    if (comp.useCustomTextures && comp.bgTexture && comp.fillTexture) {
        componentInitString +=
        `            private final net.minecraft.resources.ResourceLocation bgTex = net.minecraft.resources.ResourceLocation.parse("${comp.bgTexture}");\n` +
        `            private final net.minecraft.resources.ResourceLocation fillTex = net.minecraft.resources.ResourceLocation.parse("${comp.fillTexture}");\n\n` +
        `            @Override\n` +
        `            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {\n` +
        `                float progress = Math.max(0.0f, Math.min(1.0f, (val_${comp.id} - min) / (max - min)));\n` +
        `                guiGraphics.blit(bgTex, this.getX(), this.getY(), 0, 0, this.width, this.height, this.width, this.height);\n` +
        fillLogicTex +
        `            }\n`;
    } else {
        const barColor = comp.color || "0xFF10B981";
        const bgBarColor = comp.bgColor || "0xFF3F3F46";
        componentInitString +=
        `\n            @Override\n` +
        `            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {\n` +
        `                float progress = Math.max(0.0f, Math.min(1.0f, (val_${comp.id} - min) / (max - min)));\n` +
        `                int color = (int) Long.parseLong("${barColor}".replace("0x", ""), 16);\n` +
        `                guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height, (int) Long.parseLong("${bgBarColor}".replace("0x", ""), 16));\n` +
        fillLogicSolid +
        `            }\n`;
    }

    componentInitString += `            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}\n        }`;

    const initCode = [];
    const scrollChildrenCode = [];
    if (comp.parentId) {
        scrollChildrenCode.push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
        initCode.push(`        // Progress Bar: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
    }
    
    return { fields, initCode, renderBgCode: [], scrollChildrenCode };
  }
};
