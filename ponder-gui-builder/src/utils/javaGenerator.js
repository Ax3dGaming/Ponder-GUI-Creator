const generateMenuCode = (guiConfig, slots, hasPlayerInv) => {
  let slotRegistrations = [];
  
  slots.forEach((slot, index) => {
    if (slot.type === 'InputSlot') {
      slotRegistrations.push(`        // Input Slot: ${slot.id}\n        this.addSlot(new Slot(container, ${index}, ${slot.x}, ${slot.y}));`);
    } else if (slot.type === 'OutputSlot') {
      slotRegistrations.push(`        // Output Slot: ${slot.id}\n        this.addSlot(new Slot(container, ${index}, ${slot.x}, ${slot.y}) {`);
      slotRegistrations.push(`            @Override public boolean mayPlace(ItemStack stack) { return false; }`);
      slotRegistrations.push(`        });`);
    }
  });

  let playerInvSlotsCode = "";
  if (hasPlayerInv) {
      playerInvSlotsCode = `
        // Player Inventory layout slots
        for (int si = 0; si < 3; ++si) {
            for (int sj = 0; sj < 9; ++sj) {
                this.addSlot(new Slot(playerInventory, sj + si * 9 + 9, 8 + sj * 18, 84 + si * 18));
            }
        }
        // Player Hotbar layout slots
        for (int si = 0; si < 9; ++si) {
            this.addSlot(new Slot(playerInventory, si, 8 + si * 18, 142));
        }`;
  }

  const actualMenuPackage = guiConfig.menuPackage || `com.${guiConfig.modId}.world.inventory`;

  return `package ${actualMenuPackage};

import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.inventory.AbstractContainerMenu;
import net.minecraft.world.inventory.Slot;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.Container;
import net.minecraft.world.SimpleContainer;

public class ${guiConfig.className}Menu extends AbstractContainerMenu {
    
    private final Container container;

    public ${guiConfig.className}Menu(int containerId, Inventory playerInventory) {
        this(containerId, playerInventory, new SimpleContainer(${slots.length}));
    }

    public ${guiConfig.className}Menu(int containerId, Inventory playerInventory, Container container) {
        super(ModMenuTypes.${guiConfig.className.toUpperCase()}_MENU.get(), containerId);
        this.container = container;
        checkContainerSize(container, ${slots.length});
        container.startOpen(playerInventory.player);

        // --- GENERATED SLOTS REGISTERING ---
${slotRegistrations.join('\n')}
        // ------------------------------------
${playerInvSlotsCode}
    }

    @Override
    public ItemStack quickMoveStack(Player player, int index) {
        return ItemStack.EMPTY;
    }

    @Override
    public boolean stillValid(Player player) {
        return this.container.stillValid(player);
    }
}`;
};

export const generateJavaCode = (guiConfig, components) => {
  const slots = components.filter(c => c.type.includes('Slot'));
  const hasPlayerInv = components.some(c => c.type === 'PlayerInventory');
  
  const menuClassName = `${guiConfig.className}Menu`;
  const baseClass = `AbstractContainerScreen<${menuClassName}>`;

  const actualMenuPackage = guiConfig.menuPackage || `com.${guiConfig.modId}.world.inventory`;
  const actualScreenPackage = guiConfig.screenPackage || `com.${guiConfig.modId}.client.gui`;

  let fields = [];
  let initCode = [];
  let renderBgCode = [];

  const texWidth = guiConfig.textureWidth || 256;
  const texHeight = guiConfig.textureHeight || 256;

  const textureLocation = `net.minecraft.resources.ResourceLocation.parse("${guiConfig.customTexture || 'pondertestgui:textures/gui/bg.png'}")`;
  if (texWidth !== 256 || texHeight !== 256) {
      renderBgCode.push(`        guiGraphics.blit(${textureLocation}, this.leftPos, this.topPos, 0, 0, ${guiConfig.bgWidth}, ${guiConfig.bgHeight}, ${texWidth}, ${texHeight});`);
  } else {
      renderBgCode.push(`        guiGraphics.blit(${textureLocation}, this.leftPos, this.topPos, 0, 0, ${guiConfig.bgWidth}, ${guiConfig.bgHeight});`);
  }

  let scrollPanelChildrenMap = {};
  let scrollPanelIds = [];

  const getTextComponent = (comp) => {
      return comp.isTranslatable ? `Component.translatable("${comp.text}")` : `Component.literal("${comp.text}")`;
  };

  const getButtonActionCode = (comp) => {
      if (comp.actionType === 'OPEN_SCREEN' && comp.actionTarget) {
          return `net.minecraft.client.Minecraft.getInstance().setScreen(new ${comp.actionTarget}(/* TODO: Add required constructor arguments */));`;
      } else if (comp.actionType === 'CLOSE_SCREEN') {
          return `this.onClose();`;
      } else if (comp.actionType === 'PRINT_CONSOLE' && comp.actionTarget) {
          return `System.out.println("${comp.actionTarget.replace(/"/g, '\\"')}");`;
      }
      return `// Click Action`;
  };

  components.forEach(comp => {
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;

    let componentInitString = "";

    switch (comp.type) {
      case 'ItemDisplay':
        const scaleItem = comp.itemScale !== undefined ? comp.itemScale : 1.0;
        const rX = comp.itemRotationX || 0;
        const rY = comp.itemRotationY || 0;
        const rZ = comp.itemRotationZ || 0;
        
        let itemRenderCode = `        guiGraphics.pose().pushPose();\n`;
        itemRenderCode += `        guiGraphics.pose().translate(${posX} + 8.0f, ${posY} + 8.0f, 0.0f);\n`;
        if (scaleItem !== 1.0) itemRenderCode += `        guiGraphics.pose().scale(${scaleItem}f, ${scaleItem}f, 1.0f);\n`;
        if (rX !== 0) itemRenderCode += `        guiGraphics.pose().mulPose(com.mojang.math.Axis.XP.rotationDegrees(${rX}f));\n`;
        if (rY !== 0) itemRenderCode += `        guiGraphics.pose().mulPose(com.mojang.math.Axis.YP.rotationDegrees(${rY}f));\n`;
        if (rZ !== 0) itemRenderCode += `        guiGraphics.pose().mulPose(com.mojang.math.Axis.ZP.rotationDegrees(${rZ}f));\n`;
        itemRenderCode += `        guiGraphics.renderFakeItem(new ItemStack(net.minecraft.core.registries.BuiltInRegistries.ITEM.get(net.minecraft.resources.ResourceLocation.parse("${comp.item}"))), -8, -8);\n`;
        itemRenderCode += `        guiGraphics.pose().popPose();`;

        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(itemRenderCode);
        } else {
            renderBgCode.push(itemRenderCode);
        }
        break;

      case 'EntityDisplay':
        fields.push(`    private net.minecraft.world.entity.LivingEntity entity_${comp.id};`);
        
        const entityInit = `        net.minecraft.world.entity.EntityType<?> type_${comp.id} = net.minecraft.core.registries.BuiltInRegistries.ENTITY_TYPE.get(net.minecraft.resources.ResourceLocation.parse("${comp.entity}"));\n` +
                           `        if (type_${comp.id} != null && this.minecraft != null && this.minecraft.level != null) {\n` +
                           `            this.entity_${comp.id} = (net.minecraft.world.entity.LivingEntity) type_${comp.id}.create(this.minecraft.level);\n` +
                           `        }`;
        initCode.push(entityInit);

        const follow = comp.entityFollowMouse !== false;
        const eX = comp.entityRotationX || 0;
        const eY = comp.entityRotationY || 0;
        const eZ = comp.entityRotationZ || 0;

        let entityRender = `        if (this.entity_${comp.id} != null) {\n`;
        
        entityRender += `            int posX = ${posX} + ${Math.round(comp.width / 2)};\n`;
        entityRender += `            int posY = ${posY} + ${comp.height};\n`;
        entityRender += `            int scale = ${comp.entityScale || 30};\n\n`;

        if (follow) {
            entityRender += `            float mouseDeltaX = (float) (posX - mouseX);\n`;
            entityRender += `            float mouseDeltaY = (float) (posY - scale - mouseY);\n\n`;
            entityRender += `            this.entity_${comp.id}.setYRot(180.0F + mouseDeltaX * 0.04F);\n`;
            entityRender += `            this.entity_${comp.id}.setXRot(mouseDeltaY * 0.1F);\n`;
            entityRender += `            this.entity_${comp.id}.yBodyRot = 180.0F + mouseDeltaX * 0.02F;\n`;
        } else {
            entityRender += `            this.entity_${comp.id}.setYRot(180.0F + ${eY}F);\n`;
            entityRender += `            this.entity_${comp.id}.setXRot(${eX}F);\n`;
            entityRender += `            this.entity_${comp.id}.yBodyRot = 180.0F + ${eY}F;\n`;
        }

        entityRender += `            this.entity_${comp.id}.yHeadRot = this.entity_${comp.id}.getYRot();\n`;
        entityRender += `            this.entity_${comp.id}.yHeadRotO = this.entity_${comp.id}.getYRot();\n\n`;
        
        entityRender += `            org.joml.Quaternionf quaternionf = (new org.joml.Quaternionf()).rotationZ((float)Math.PI);\n`;
        entityRender += `            org.joml.Quaternionf quaternionf1 = (new org.joml.Quaternionf()).rotationX(this.entity_${comp.id}.getXRot() * ((float)Math.PI / 180F));\n`;
        entityRender += `            quaternionf.mul(quaternionf1);\n\n`;

        if (!follow && eZ !== 0) {
            entityRender += `            org.joml.Quaternionf quaternionfZ = (new org.joml.Quaternionf()).rotationZ(${eZ}F * ((float)Math.PI / 180F));\n`;
            entityRender += `            quaternionf.mul(quaternionfZ);\n\n`;
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
        
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(entityRender);
        } else {
            renderBgCode.push(entityRender);
        }
        break;

      case 'HoverArea':
        fields.push(`    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`);
        componentInitString = `new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {\n` +
        `            @Override\n` +
        `            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {}\n` +
        `            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}\n` +
        `        }`;
        
        let tooltipSetter = `        this.${comp.id}.setTooltip(net.minecraft.client.gui.components.Tooltip.create(${getTextComponent(comp)}));`;

        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n${tooltipSetter}\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Hover Tooltip Area: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n${tooltipSetter}\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'Label':
        fields.push(`    private net.minecraft.client.gui.components.StringWidget ${comp.id};`);
        componentInitString = `new net.minecraft.client.gui.components.StringWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, ${getTextComponent(comp)}, this.font).setColor(${comp.color || '0xFFFFFF'})`;
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Label: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableOnly(this.${comp.id});`);
        }
        break;

      case 'Button':
        fields.push(`    private net.minecraft.client.gui.components.Button ${comp.id};`);
        componentInitString = `net.minecraft.client.gui.components.Button.builder(${getTextComponent(comp)}, button -> {\n            ${getButtonActionCode(comp)}\n        }).bounds(${posX}, ${posY}, ${comp.width}, ${comp.height}).build()`;
        
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'ProgressBar':
        fields.push(`    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`);
        
        componentInitString = `new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {\n` +
        `            private float min = ${comp.minVal}f;\n` +
        `            private float max = ${comp.maxVal}f;\n` +
        `            private float val = ${comp.currentVal}f;\n`;

        if (comp.useCustomTextures && comp.bgTexture && comp.fillTexture) {
            componentInitString +=
            `            private final net.minecraft.resources.ResourceLocation bgTex = net.minecraft.resources.ResourceLocation.parse("${comp.bgTexture}");\n` +
            `            private final net.minecraft.resources.ResourceLocation fillTex = net.minecraft.resources.ResourceLocation.parse("${comp.fillTexture}");\n\n` +
            `            @Override\n` +
            `            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {\n` +
            `                float progress = Math.max(0.0f, Math.min(1.0f, (val - min) / (max - min)));\n` +
            `                int fgWidth = (int)(this.width * progress);\n` +
            `                guiGraphics.blit(bgTex, this.getX(), this.getY(), 0, 0, this.width, this.height, this.width, this.height);\n` +
            `                if (fgWidth > 0) {\n` +
            `                    guiGraphics.blit(fillTex, this.getX(), this.getY(), 0, 0, fgWidth, this.height, this.width, this.height);\n` +
            `                }\n` +
            `            }\n`;
        } else {
            const barColor = comp.color || "0xFF10B981";
            const bgBarColor = comp.bgColor || "0xFF3F3F46";
            componentInitString +=
            `\n            @Override\n` +
            `            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {\n` +
            `                float progress = Math.max(0.0f, Math.min(1.0f, (val - min) / (max - min)));\n` +
            `                int fgWidth = (int)(this.width * progress);\n` +
            `                guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height, (int) Long.parseLong("${bgBarColor}".replace("0x", ""), 16));\n` +
            `                if (fgWidth > 0) {\n` +
            `                    guiGraphics.fill(this.getX(), this.getY(), this.getX() + fgWidth, this.getY() + this.height, (int) Long.parseLong("${barColor}".replace("0x", ""), 16));\n` +
            `                }\n` +
            `            }\n`;
        }

        componentInitString += `            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}\n        }`;

        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Progress Bar: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'Slider':
        fields.push(`    private net.minecraft.client.gui.components.AbstractSliderButton ${comp.id};`);
        
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

        if (comp.useCustomTextures && comp.sliderTrackTex && comp.sliderThumbTex) {
            const trackRes = `net.minecraft.resources.ResourceLocation.parse("${comp.sliderTrackTex}")`;
            const thumbRes = `net.minecraft.resources.ResourceLocation.parse("${comp.sliderThumbTex}")`;
            const thumbW = comp.sliderThumbWidth || 8;

            componentInitString = `new net.minecraft.client.gui.components.AbstractSliderButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty(), ${comp.currentVal / comp.maxVal}) {\n` +
            `            @Override protected void updateMessage() { this.setMessage(${javaMessageExpression}); }\n` +
            `            @Override protected void applyValue() { /* Tracking code */ }\n` +
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
            componentInitString = `new net.minecraft.client.gui.components.AbstractSliderButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty(), ${comp.currentVal / comp.maxVal}) {\n            @Override protected void updateMessage() { this.setMessage(${javaMessageExpression}); }\n            @Override protected void applyValue() { /* Tracking code */ }\n        }`;
        }
        
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.id}.updateMessage();\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Slider Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.${comp.id}.updateMessage();\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'ImageButton':
        fields.push(`    private net.minecraft.client.gui.components.ImageButton ${comp.id};`);
        componentInitString = `new net.minecraft.client.gui.components.ImageButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, new net.minecraft.client.gui.components.WidgetSprites(net.minecraft.resources.ResourceLocation.parse("${comp.texture || 'pondertestgui:textures/gui/widgets.png'}")), button -> {\n            ${getButtonActionCode(comp)}\n        })`;
        
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Image Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'EditBox':
        fields.push(`    private net.minecraft.client.gui.components.EditBox ${comp.id};`);
        const hintComp = comp.isTranslatable ? `Component.translatable("${comp.placeholder}")` : `Component.literal("${comp.placeholder}")`;
        componentInitString = `new net.minecraft.client.gui.components.EditBox(this.font, ${posX}, ${posY}, ${comp.width}, ${comp.height}, ${hintComp})`;
        
        let responderCode = "";
        if (comp.actionType === 'UPDATE_LABEL' && comp.actionTarget) {
            responderCode = `\n        this.${comp.id}.setResponder(text -> { if (this.${comp.actionTarget} != null) this.${comp.actionTarget}.setMessage(Component.literal(text)); });`;
        } else if (comp.actionType === 'PRINT_CONSOLE') {
            responderCode = `\n        this.${comp.id}.setResponder(text -> System.out.println("${comp.id} changed: " + text));`;
        }

        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.id}.setHint(${hintComp});${responderCode}\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // EditBox: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.${comp.id}.setHint(${hintComp});${responderCode}\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'Image':
        const imgLoc = `net.minecraft.resources.ResourceLocation.parse("${comp.texture || 'pondertestgui:textures/gui/custom_image.png'}")`;
        
        let imgRenderCode = "";
        if (comp.color && comp.color !== '0xFFFFFFFF' && comp.color !== '0xFFFFFF') {
            imgRenderCode += `        int color_${comp.id} = (int) Long.parseLong("${comp.color}".replace("0x", ""), 16);\n`;
            imgRenderCode += `        guiGraphics.setColor(((color_${comp.id} >> 16) & 0xFF) / 255.0F, ((color_${comp.id} >> 8) & 0xFF) / 255.0F, (color_${comp.id} & 0xFF) / 255.0F, ((color_${comp.id} >> 24) & 0xFF) / 255.0F);\n`;
            imgRenderCode += `        guiGraphics.blit(${imgLoc}, ${posX}, ${posY}, 0, 0, ${comp.width}, ${comp.height}, ${comp.width}, ${comp.height});\n`;
            imgRenderCode += `        guiGraphics.setColor(1.0F, 1.0F, 1.0F, 1.0F);\n`;
        } else {
            imgRenderCode = `        guiGraphics.blit(${imgLoc}, ${posX}, ${posY}, 0, 0, ${comp.width}, ${comp.height}, ${comp.width}, ${comp.height});`;
        }

        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(imgRenderCode);
        } else {
            renderBgCode.push(`        // Static Image: ${comp.id}\n` + imgRenderCode);
        }
        break;

      case 'InputSlot':
        initCode.push(`        // Slot input: ${comp.id} registered via Menu at relative X: ${comp.x}, Y: ${comp.y}`);
        break;

      case 'OutputSlot':
        initCode.push(`        // Slot output: ${comp.id} registered via Menu at relative X: ${comp.x}, Y: ${comp.y}`);
        break;

      case 'PlayerInventory':
        initCode.push(`        // Player Inventory layout auto-registered by Menu template layout`);
        break;
    }
  });

  components.forEach(comp => {
    if (comp.type === 'ScrollPanel') {
        const sx = comp.scrollX || false;
        const sy = comp.scrollY !== false;
        const customPkg = comp.widgetPackage || `com.${guiConfig.modId}.client.gui.components`;
        
        const panelX = `this.leftPos + ${comp.x}`;
        const panelY = `this.topPos + ${comp.y}`;
        
        const borderShow = comp.showBorder !== false;
        const borderCol = comp.borderColor || "0x803B82F6";

        fields.push(`    private ${customPkg}.ScrollPanelWidget ${comp.id};`);
        scrollPanelIds.push(comp.id);

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

        if (scrollPanelChildrenMap[comp.id]) {
            panelBlock.push(...scrollPanelChildrenMap[comp.id]);
        }
        
        panelBlock.push(`        this.addRenderableWidget(this.${comp.id});`);
        initCode.push(panelBlock.join('\n'));
    }
  });

  // GESTION MAGIQUE DES TOUCHES (Bloquer la touche E si une EditBox est sélectionnée)
  let editBoxIds = components.filter(c => c.type === 'EditBox').map(c => c.id);
  let editBoxChecks = editBoxIds.length > 0 ? editBoxIds.map(id => `this.${id} != null && this.${id}.isFocused()`).join(' || ') : 'false';

  let scrollCalls = scrollPanelIds.map(id => `        if (this.${id}.mouseScrolled(mouseX, mouseY, scrollX, scrollY)) return true;`).join('\n');
  let clickCalls = scrollPanelIds.map(id => `        if (this.${id}.mouseClicked(mouseX, mouseY, button)) { this.setFocused(this.${id}); return true; }`).join('\n');
  let releaseCalls = scrollPanelIds.map(id => `        if (this.${id}.mouseReleased(mouseX, mouseY, button)) return true;`).join('\n');
  let dragCalls = scrollPanelIds.map(id => `        if (this.${id}.mouseDragged(mouseX, mouseY, button, dragX, dragY)) return true;`).join('\n');

  let mouseListenersCode = `
    @Override
    public boolean mouseScrolled(double mouseX, double mouseY, double scrollX, double scrollY) {
        ${scrollCalls.length > 0 ? scrollCalls : ''}
        return super.mouseScrolled(mouseX, mouseY, scrollX, scrollY);
    }

    @Override
    public boolean mouseClicked(double mouseX, double mouseY, int button) {
        ${clickCalls.length > 0 ? clickCalls : ''}
        return super.mouseClicked(mouseX, mouseY, button);
    }

    @Override
    public boolean mouseReleased(double mouseX, double mouseY, int button) {
        ${releaseCalls.length > 0 ? releaseCalls : ''}
        return super.mouseReleased(mouseX, mouseY, button);
    }

    @Override
    public boolean mouseDragged(double mouseX, double mouseY, int button, double dragX, double dragY) {
        ${dragCalls.length > 0 ? dragCalls : ''}
        return super.mouseDragged(mouseX, mouseY, button, dragX, dragY);
    }

    @Override
    public boolean keyPressed(int keyCode, int scanCode, int modifiers) {
        boolean isEditBoxFocused = ${editBoxChecks};
        if (isEditBoxFocused) {
            if (this.getFocused() != null && this.getFocused().keyPressed(keyCode, scanCode, modifiers)) {
                return true;
            }
            if (keyCode == 256) { // Escape
                this.onClose();
                return true;
            }
            return true; // Empêche AbstractContainerScreen de fermer le GUI avec la touche Inventaire
        }
        return super.keyPressed(keyCode, scanCode, modifiers);
    }`;

  let labelsHideCode = "";
  if (!hasPlayerInv) {
      labelsHideCode = `\n        this.titleLabelX = 99999;\n        this.inventoryLabelX = 99999;`;
  }

  const screenCode = `package ${actualScreenPackage};

import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.item.ItemStack;
import ${actualMenuPackage}.${menuClassName};

public class ${guiConfig.className}Screen extends AbstractContainerScreen<${menuClassName}> {

${fields.join('\n')}

    public ${guiConfig.className}Screen(${menuClassName} menu, Inventory playerInv, Component title) {
        super(menu, playerInv, title);
        this.imageWidth = ${guiConfig.bgWidth || 176};
        this.imageHeight = ${guiConfig.bgHeight || 166};${labelsHideCode}
    }

    @Override
    protected void init() {
        super.init();
        this.leftPos = (this.width - this.imageWidth) / 2;
        this.topPos = (this.height - this.imageHeight) / 2;

        // --- GENERATED WIDGETS ---
${initCode.join('\n')}
        // -------------------------
    }

    @Override
    public void render(GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {
        super.render(guiGraphics, mouseX, mouseY, partialTick);
        this.renderTooltip(guiGraphics, mouseX, mouseY);
    }

    @Override
    protected void renderBg(GuiGraphics guiGraphics, float partialTick, int mouseX, int mouseY) {
${renderBgCode.join('\n')}
    }
${mouseListenersCode}

    @Override
    public boolean isPauseScreen() {
        return false;
    }
}`;

  return {
    type: "CONTAINER",
    screenFileName: `${guiConfig.className}Screen.java`,
    screenCode: screenCode,
    menuFileName: `${guiConfig.className}Menu.java`,
    menuCode: generateMenuCode(guiConfig, slots, hasPlayerInv)
  };
};