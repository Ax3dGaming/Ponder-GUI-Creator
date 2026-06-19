export const ButtonGenerator = {
  generateJava: (comp, { getButtonActionCode, getTextComponent }) => {
    const fields = [`    private net.minecraft.client.gui.components.Button ${comp.id};`];
    
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    const componentInitString = `net.minecraft.client.gui.components.Button.builder(${getTextComponent(comp)}, button -> {\n            ${getButtonActionCode(comp)}\n        }).bounds(${posX}, ${posY}, ${comp.width}, ${comp.height}).build()`;
    
    const initCode = [];
    const scrollChildrenCode = [];
    
    if (comp.parentId) {
      scrollChildrenCode.push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
      initCode.push(`        // Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
    }
    
    return { fields, initCode, renderBgCode: [], scrollChildrenCode };
  }
};
