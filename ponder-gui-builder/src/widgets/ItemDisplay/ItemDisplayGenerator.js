export const ItemDisplayGenerator = {
  generateJava: (comp) => {
    const fields = [
        `    private float scale_${comp.id} = ${comp.itemScale !== undefined ? comp.itemScale : 1.0}f;`,
        `    private float rotX_${comp.id} = ${comp.itemRotationX || 0}f;`,
        `    private float rotY_${comp.id} = ${comp.itemRotationY || 0}f;`,
        `    private float rotZ_${comp.id} = ${comp.itemRotationZ || 0}f;`
    ];
    
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    let rotYCode = `        if (this.rotY_${comp.id} != 0) guiGraphics.pose().mulPose(com.mojang.math.Axis.YP.rotationDegrees(this.rotY_${comp.id}));\n`;
    if (comp.animateRotation) {
        rotYCode = `        guiGraphics.pose().mulPose(com.mojang.math.Axis.YP.rotationDegrees(this.rotY_${comp.id} + (float)((net.minecraft.Util.getMillis() % 3600L) / 10.0f)));\n`;
    }

    let itemRenderCode = `        guiGraphics.pose().pushPose();\n`;
    itemRenderCode += `        guiGraphics.pose().translate(${posX} + 8.0f, ${posY} + 8.0f, 0.0f);\n`;
    itemRenderCode += `        if (this.scale_${comp.id} != 1.0f) guiGraphics.pose().scale(this.scale_${comp.id}, this.scale_${comp.id}, 1.0f);\n`;
    itemRenderCode += `        if (this.rotX_${comp.id} != 0) guiGraphics.pose().mulPose(com.mojang.math.Axis.XP.rotationDegrees(this.rotX_${comp.id}));\n`;
    itemRenderCode += rotYCode;
    itemRenderCode += `        if (this.rotZ_${comp.id} != 0) guiGraphics.pose().mulPose(com.mojang.math.Axis.ZP.rotationDegrees(this.rotZ_${comp.id}));\n`;
    itemRenderCode += `        guiGraphics.renderFakeItem(new ItemStack(net.minecraft.core.registries.BuiltInRegistries.ITEM.get(net.minecraft.resources.ResourceLocation.parse("${comp.item}"))), -8, -8);\n`;
    itemRenderCode += `        guiGraphics.pose().popPose();\n`;

    if (comp.showTooltip) {
        itemRenderCode += `        if (mouseX >= ${posX} && mouseX <= ${posX} + ${comp.width} && mouseY >= ${posY} && mouseY <= ${posY} + ${comp.height}) {\n`;
        itemRenderCode += `            guiGraphics.renderTooltip(net.minecraft.client.Minecraft.getInstance().font, new ItemStack(net.minecraft.core.registries.BuiltInRegistries.ITEM.get(net.minecraft.resources.ResourceLocation.parse("${comp.item}"))), mouseX, mouseY);\n`;
        itemRenderCode += `        }`;
    }

    const renderBgCode = [];
    const scrollChildrenCode = [];
    
    if (comp.parentId) {
        scrollChildrenCode.push(itemRenderCode);
    } else {
        renderBgCode.push(itemRenderCode);
    }
    
    return { fields, initCode: [], renderBgCode, scrollChildrenCode };
  }
};
