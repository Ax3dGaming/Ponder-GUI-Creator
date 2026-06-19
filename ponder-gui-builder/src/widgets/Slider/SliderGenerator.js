export const SliderGenerator = {
  generateJava: (comp) => {
    const fields = [`    private net.minecraft.client.gui.components.AbstractSliderButton ${comp.id};`];
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    const isPrefix = comp.isTextPrefix !== false;
    const fmt = comp.formatNumber || 'x';
    const baseTextComp = comp.isTranslatable ? `Component.translatable("${comp.text}")` : `Component.literal("${comp.text}")`;

    let javaMessageExpression = "";
    if (!isPrefix) {
        javaMessageExpression = baseTextComp;
    } else {
        let valCalculation = `this.value * ${comp.maxVal}`;
        if (fmt === 'x') {
            javaMessageExpression = `Component.empty().append(${baseTextComp}).append(Component.literal(": " + (int)(${valCalculation})))`;
        } else if (fmt === 'x.x') {
            javaMessageExpression = `Component.empty().append(${baseTextComp}).append(Component.literal(": " + String.format(java.util.Locale.US, "%.1f", ${valCalculation})))`;
        } else if (fmt === 'x.xx') {
            javaMessageExpression = `Component.empty().append(${baseTextComp}).append(Component.literal(": " + String.format(java.util.Locale.US, "%.2f", ${valCalculation})))`;
        } else if (fmt === 'x.xxx') {
            javaMessageExpression = `Component.empty().append(${baseTextComp}).append(Component.literal(": " + String.format(java.util.Locale.US, "%.3f", ${valCalculation})))`;
        }
    }

    let sliderApplyValueCode = ``;
    if (comp.actionType === 'UPDATE_TARGET_SCALE' && comp.actionTarget) {
        sliderApplyValueCode = `scale_${comp.actionTarget} = (float)(this.value * ${comp.maxVal});`;
    } else if (comp.actionType === 'UPDATE_TARGET_ROTATION' && comp.actionTarget) {
        sliderApplyValueCode = `rotY_${comp.actionTarget} = (float)(this.value * ${comp.maxVal});`;
    } else if (comp.actionType === 'UPDATE_PROGRESS_BAR' && comp.actionTarget) {
        sliderApplyValueCode = `val_${comp.actionTarget} = (float)(this.value * ${comp.maxVal});`;
    }

    let componentInitString = "";
    if (comp.useCustomTextures && comp.sliderTrackTex && comp.sliderThumbTex) {
        const trackRes = `net.minecraft.resources.ResourceLocation.parse("${comp.sliderTrackTex}")`;
        const thumbRes = `net.minecraft.resources.ResourceLocation.parse("${comp.sliderThumbTex}")`;
        const thumbW = comp.sliderThumbWidth || 8;

        componentInitString = `new net.minecraft.client.gui.components.AbstractSliderButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty(), ${comp.currentVal / comp.maxVal}) {\n` +
        `            {\n` +
        `                this.updateMessage();\n` +
        `            }\n` +
        `            @Override protected void updateMessage() { this.setMessage(${javaMessageExpression}); }\n` +
        `            @Override protected void applyValue() { ${sliderApplyValueCode} }\n` +
        `            @Override\n` +
        `            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {\n` +
        `                guiGraphics.blit(${trackRes}, this.getX(), this.getY(), 0, 0, this.width, this.height, this.width, this.height);\n` +
        `                int thumbX = this.getX() + (int)(this.value * (this.width - ${thumbW}));\n` +
        `                guiGraphics.blit(${thumbRes}, thumbX, this.getY(), 0, 0, ${thumbW}, this.height, ${thumbW}, this.height);\n` +
        `                int textColor = this.active ? 16777215 : 10526880;\n` +
        `                guiGraphics.drawCenteredString(net.minecraft.client.Minecraft.getInstance().font, this.getMessage(), this.getX() + this.width / 2, this.getY() + (this.height - 8) / 2, textColor | net.minecraft.util.Mth.ceil(this.alpha * 255.0F) << 24);\n` +
        `            }\n` +
        `        }`;
    } else {
        componentInitString = `new net.minecraft.client.gui.components.AbstractSliderButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty(), ${comp.currentVal / comp.maxVal}) {\n` +
        `            {\n` +
        `                this.updateMessage();\n` +
        `            }\n` +
        `            @Override protected void updateMessage() { this.setMessage(${javaMessageExpression}); }\n` +
        `            @Override protected void applyValue() { ${sliderApplyValueCode} }\n` +
        `        }`;
    }
    
    const initCode = [];
    const scrollChildrenCode = [];
    
    if (comp.parentId) {
        scrollChildrenCode.push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
        initCode.push(`        // Slider Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
    }
    
    return { fields, initCode, renderBgCode: [], scrollChildrenCode };
  }
};
