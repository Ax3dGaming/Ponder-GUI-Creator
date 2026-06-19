export const LabelGenerator = {
  generateJava: (comp, { getTextComponent }) => {
    const fields = [`    private net.minecraft.client.gui.components.StringWidget ${comp.id};`];
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    const componentInitString = `new net.minecraft.client.gui.components.StringWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, ${getTextComponent(comp)}, this.font).setColor(${comp.color || '0xFFFFFF'})`;
    
    const initCode = [];
    const scrollChildrenCode = [];
    if (comp.parentId) {
      scrollChildrenCode.push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
      initCode.push(`        // Label: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableOnly(this.${comp.id});`);
    }
    return { fields, initCode, renderBgCode: [], scrollChildrenCode };
  }
};
