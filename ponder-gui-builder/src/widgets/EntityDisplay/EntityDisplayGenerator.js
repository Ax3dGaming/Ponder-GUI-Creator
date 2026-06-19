export const EntityDisplayGenerator = {
  generateJava: (comp) => {
    const fields = [
        `    private net.minecraft.world.entity.LivingEntity entity_${comp.id};`,
        `    private float scale_${comp.id} = ${comp.entityScale || 30}f;`,
        `    private float rotX_${comp.id} = ${comp.entityRotationX || 0}f;`,
        `    private float rotY_${comp.id} = ${comp.entityRotationY || 0}f;`,
        `    private float rotZ_${comp.id} = ${comp.entityRotationZ || 0}f;`
    ];
    
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;
    
    const entityInit = `        net.minecraft.world.entity.EntityType<?> type_${comp.id} = net.minecraft.core.registries.BuiltInRegistries.ENTITY_TYPE.get(net.minecraft.resources.ResourceLocation.parse("${comp.entity}"));\n` +
                       `        if (type_${comp.id} != null && this.minecraft != null && this.minecraft.level != null) {\n` +
                       `            this.entity_${comp.id} = (net.minecraft.world.entity.LivingEntity) type_${comp.id}.create(this.minecraft.level);\n` +
                       `        }`;

    const follow = comp.entityFollowMouse !== false;

    let entityRender = `        if (this.entity_${comp.id} != null) {\n`;
    entityRender += `            int posX = ${posX} + ${Math.round(comp.width / 2)};\n`;
    entityRender += `            int posY = ${posY} + ${comp.height};\n`;
    entityRender += `            int scale = (int) this.scale_${comp.id};\n\n`;

    if (follow) {
        entityRender += `            float mouseDeltaX = (float) (posX - mouseX);\n`;
        entityRender += `            float mouseDeltaY = (float) (posY - scale - mouseY);\n\n`;
        entityRender += `            this.entity_${comp.id}.setYRot(180.0F + mouseDeltaX * 0.04F);\n`;
        entityRender += `            this.entity_${comp.id}.setXRot(mouseDeltaY * 0.1F);\n`;
        entityRender += `            this.entity_${comp.id}.yBodyRot = 180.0F + mouseDeltaX * 0.02F;\n`;
    } else {
        entityRender += `            this.entity_${comp.id}.setYRot(180.0F + this.rotY_${comp.id});\n`;
        entityRender += `            this.entity_${comp.id}.setXRot(this.rotX_${comp.id});\n`;
        entityRender += `            this.entity_${comp.id}.yBodyRot = 180.0F + this.rotY_${comp.id};\n`;
    }

    entityRender += `            this.entity_${comp.id}.yHeadRot = this.entity_${comp.id}.getYRot();\n`;
    entityRender += `            this.entity_${comp.id}.yHeadRotO = this.entity_${comp.id}.getYRot();\n\n`;
    
    entityRender += `            org.joml.Quaternionf quaternionf = (new org.joml.Quaternionf()).rotationZ((float)Math.PI);\n`;
    entityRender += `            org.joml.Quaternionf quaternionf1 = (new org.joml.Quaternionf()).rotationX(this.entity_${comp.id}.getXRot() * ((float)Math.PI / 180F));\n`;
    entityRender += `            quaternionf.mul(quaternionf1);\n\n`;

    if (!follow) {
        entityRender += `            if (this.rotZ_${comp.id} != 0) {\n`;
        entityRender += `                org.joml.Quaternionf quaternionfZ = (new org.joml.Quaternionf()).rotationZ(this.rotZ_${comp.id} * ((float)Math.PI / 180F));\n`;
        entityRender += `                quaternionf.mul(quaternionfZ);\n`;
        entityRender += `            }\n\n`;
    }
    
    entityRender += `            net.minecraft.client.gui.screens.inventory.InventoryScreen.renderEntityInInventory(\n`;
    entityRender += `                    guiGraphics,\n`;
    entityRender += `                    (float)posX,\n`;
    entityRender += `                    (float)posY,\n`;
    entityRender += `                    (float)scale,\n`;
    entityRender += `                    new org.joml.Vector3f(0.0F, 0.0F, 0.0F),\n`;
    entityRender += `                    quaternionf,\n`;
    entityRender += `                    quaternionf1,\n`;
    entityRender += `                    this.entity_${comp.id}\n`;
    entityRender += `            );\n`;
    entityRender += `        }`;
    
    const initCode = [entityInit];
    const renderBgCode = [];
    const scrollChildrenCode = [];
    
    if (comp.parentId) {
        scrollChildrenCode.push(entityRender);
    } else {
        renderBgCode.push(entityRender);
    }
    
    return { fields, initCode, renderBgCode, scrollChildrenCode };
  }
};
