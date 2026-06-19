export const ScrollPanelGenerator = {
  // This generator doesn't use the standard generateJava signature because it needs children.
  // It will be handled specifically in javaGenerator.js, or we can adapt it.
  generateJava: (comp, { guiConfig, scrollPanelChildrenMap }) => {
    const sx = comp.scrollX || false;
    const sy = comp.scrollY !== false;
    const customPkg = comp.widgetPackage || `com.${guiConfig.modId}.client.gui.components`;
    
    const panelX = `this.leftPos + ${comp.x}`;
    const panelY = `this.topPos + ${comp.y}`;
    
    const borderShow = comp.showBorder !== false;
    const borderCol = comp.borderColor || "0x803B82F6";

    const fields = [`    private ${customPkg}.ScrollPanelWidget ${comp.id};`];

    let panelBlock = [];
    panelBlock.push(`        // ScrollPanel Container: ${comp.id}`);
    panelBlock.push(`        this.${comp.id} = new ${customPkg}.ScrollPanelWidget(${panelX}, ${panelY}, ${comp.width}, ${comp.height}, ${comp.scrollX ? comp.maxScrollDistance : comp.width}, ${comp.scrollY !== false ? comp.maxScrollDistance : comp.height}, ${sx}, ${sy}, ${borderShow}, ${borderCol});`);
    
    if (comp.scrollBgTex) {
        panelBlock.push(`        this.${comp.id}.setBackgroundTexture("${comp.scrollBgTex}");`);
    }

    if (sy && comp.vTrackTex && comp.vThumbTex) {
        panelBlock.push(`        this.${comp.id}.setVerticalScrollTextures("${comp.vTrackTex}", "${comp.vThumbTex}");`);
    }
    if (sx && comp.hTrackTex && comp.hThumbTex) {
        panelBlock.push(`        this.${comp.id}.setHorizontalScrollTextures("${comp.hTrackTex}", "${comp.hThumbTex}");`);
    }

    if (scrollPanelChildrenMap && scrollPanelChildrenMap[comp.id]) {
        panelBlock.push(...scrollPanelChildrenMap[comp.id]);
    }
    
    panelBlock.push(`        this.addRenderableWidget(this.${comp.id});`);
    
    return { fields, initCode: [panelBlock.join('\n')], renderBgCode: [], scrollChildrenCode: [] };
  }
};
