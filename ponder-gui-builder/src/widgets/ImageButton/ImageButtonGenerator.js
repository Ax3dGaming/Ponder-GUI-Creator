export const ImageButtonGenerator = {
  generateJava: (comp, { getButtonActionCode }) => {
    const fields = [`    private net.minecraft.client.gui.components.ImageButton ${comp.id};`];
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    const componentInitString = `new net.minecraft.client.gui.components.ImageButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, new net.minecraft.client.gui.components.WidgetSprites(net.minecraft.resources.ResourceLocation.parse("${comp.texture || 'pondertestgui:textures/gui/widgets.png'}")), button -> {\n            ${getButtonActionCode(comp)}\n        })`;
    
    const initCode = [];
    const scrollChildrenCode = [];
    
    if (comp.parentId) {
      scrollChildrenCode.push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
      initCode.push(`        // Image Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
    }
    
    return { fields, initCode, renderBgCode: [], scrollChildrenCode };
  }
};
