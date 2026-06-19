export const ImageGenerator = {
  generateJava: (comp, { guiConfig }) => {
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    let imgRenderCode = "";
    let imgLocStr = "";
    const initCode = [];
    
    if (comp.isUrl && comp.texture) {
        const urlLoc = `net.minecraft.resources.ResourceLocation.parse("${guiConfig.modId}:url_image_${comp.id}")`;
        imgLocStr = urlLoc;
        
        initCode.push(`        // URL Image Registration: ${comp.id}`);
        initCode.push(`        net.minecraft.client.renderer.texture.HttpTexture httpTex_${comp.id} = new net.minecraft.client.renderer.texture.HttpTexture(null, "${comp.texture}", net.minecraft.resources.ResourceLocation.parse("minecraft:textures/gui/container/inventory.png"), false, null);`);
        initCode.push(`        net.minecraft.client.Minecraft.getInstance().getTextureManager().register(${urlLoc}, httpTex_${comp.id});`);
    } else {
        imgLocStr = `net.minecraft.resources.ResourceLocation.parse("${comp.texture || 'pondertestgui:textures/gui/custom_image.png'}")`;
    }
    
    const u = comp.u || 0;
    const v = comp.v || 0;

    if (comp.color && comp.color !== '0xFFFFFFFF' && comp.color !== '0xFFFFFF') {
        imgRenderCode += `        int color_${comp.id} = (int) Long.parseLong("${comp.color}".replace("0x", ""), 16);\n`;
        imgRenderCode += `        guiGraphics.setColor(((color_${comp.id} >> 16) & 0xFF) / 255.0F, ((color_${comp.id} >> 8) & 0xFF) / 255.0F, (color_${comp.id} & 0xFF) / 255.0F, ((color_${comp.id} >> 24) & 0xFF) / 255.0F);\n`;
        imgRenderCode += `        guiGraphics.blit(${imgLocStr}, ${posX}, ${posY}, ${u}, ${v}, ${comp.width}, ${comp.height});\n`;
        imgRenderCode += `        guiGraphics.setColor(1.0F, 1.0F, 1.0F, 1.0F);`;
    } else {
        imgRenderCode = `        guiGraphics.blit(${imgLocStr}, ${posX}, ${posY}, ${u}, ${v}, ${comp.width}, ${comp.height});`;
    }

    const renderBgCode = [];
    const scrollChildrenCode = [];

    if (comp.parentId) {
        scrollChildrenCode.push(imgRenderCode);
    } else {
        renderBgCode.push(`        // Static Image: ${comp.id}\n` + imgRenderCode);
    }
    
    return { fields: [], initCode, renderBgCode, scrollChildrenCode };
  }
};
