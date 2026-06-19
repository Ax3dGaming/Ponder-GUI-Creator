export const EditBoxGenerator = {
  generateJava: (comp) => {
    const fields = [`    private net.minecraft.client.gui.components.EditBox ${comp.id};`];
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    const hintComp = comp.isTranslatable ? `Component.translatable("${comp.placeholder}")` : `Component.literal("${comp.placeholder}")`;
    const componentInitString = `new net.minecraft.client.gui.components.EditBox(this.font, ${posX}, ${posY}, ${comp.width}, ${comp.height}, ${hintComp})`;
    
    let responderCode = "";
    let actionLogic = "";
    if (comp.actionType === 'UPDATE_LABEL' && comp.actionTarget) {
        actionLogic = `if (this.${comp.actionTarget} != null) this.${comp.actionTarget}.setMessage(Component.literal(text));`;
    } else if (comp.actionType === 'PRINT_CONSOLE') {
        actionLogic = `System.out.println("${comp.id} changed: " + text);`;
    }

    if (comp.actionEvent !== 'ON_ENTER' && actionLogic !== "") {
        responderCode = `\n        this.${comp.id}.setResponder(text -> { ${actionLogic} });`;
    }

    let filterCode = "";
    if (comp.forceNumeric) {
        filterCode = `\n        this.${comp.id}.setFilter(s -> s.isEmpty() || s.matches("-?\\\\d+"));`;
    }

    const initCode = [];
    const scrollChildrenCode = [];
    
    if (comp.parentId) {
        scrollChildrenCode.push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.id}.setHint(${hintComp});${filterCode}${responderCode}\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
    } else {
        initCode.push(`        // EditBox: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.${comp.id}.setHint(${hintComp});${filterCode}${responderCode}\n        this.addRenderableWidget(this.${comp.id});`);
    }
    
    return { fields, initCode, renderBgCode: [], scrollChildrenCode };
  }
};
