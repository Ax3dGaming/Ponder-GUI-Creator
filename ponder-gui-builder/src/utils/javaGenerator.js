const generateMenuCode = (guiConfig, slots, hasPlayerInv) => {
  let slotRegistrations = [];
  
  slots.forEach((slot, index) => {
    if (slot.type === 'InputSlot') {
      slotRegistrations.push(`        // Input Slot: ${slot.id}\n        this.addSlot(new Slot(container, ${index}, ${slot.x}, ${slot.y}));`);
    } else if (slot.type === 'OutputSlot') {
      const centerX = slot.x + 4;
      const centerY = slot.y + 4;
      slotRegistrations.push(`        // Output Slot (Auto-centered +4px): ${slot.id}\n        this.addSlot(new Slot(container, ${index}, ${centerX}, ${centerY}) {`);
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

  return `package com.${guiConfig.modId}.world.inventory;

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

  let fields = [];
  let initCode = [];
  let renderBgCode = [];

  const texWidth = guiConfig.textureWidth || 256;
  const texHeight = guiConfig.textureHeight || 256;

  // On force le mode CUSTOM puisque la sélection d'arrière-plan Vanilla/Container a été retirée du site
  const textureLocation = `net.minecraft.resources.ResourceLocation.parse("${guiConfig.customTexture || 'pondertestgui:textures/gui/bg.png'}")`;
  if (texWidth !== 256 || texHeight !== 256) {
      renderBgCode.push(`        guiGraphics.blit(${textureLocation}, this.leftPos, this.topPos, 0, 0, ${guiConfig.bgWidth}, ${guiConfig.bgHeight}, ${texWidth}, ${texHeight});`);
  } else {
      renderBgCode.push(`        guiGraphics.blit(${textureLocation}, this.leftPos, this.topPos, 0, 0, ${guiConfig.bgWidth}, ${guiConfig.bgHeight});`);
  }

  let scrollPanelChildrenMap = {};
  let scrollPanelIds = [];

  components.forEach(comp => {
    const posX = comp.parentId ? `${comp.x}` : `this.leftPos + ${comp.x}`;
    const posY = comp.parentId ? `${comp.y}` : `this.topPos + ${comp.y}`;

    let componentInitString = "";

    switch (comp.type) {
      case 'Label':
        componentInitString = `new net.minecraft.client.gui.components.StringWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.literal("${comp.text}"), this.font).setColor(${comp.color || '0xFFFFFF'})`;
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.parentId}.addWidget(${componentInitString});`);
        } else {
            initCode.push(`        // Label: ${comp.id}\n        this.addRenderableOnly(${componentInitString});`);
        }
        break;

      case 'Button':
        fields.push(`    private net.minecraft.client.gui.components.Button ${comp.id};`);
        componentInitString = `net.minecraft.client.gui.components.Button.builder(Component.literal("${comp.text}"), button -> {\n            // Click Action\n        }).bounds(${posX}, ${posY}, ${comp.width}, ${comp.height}).build()`;
        
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'Slider':
        fields.push(`    private net.minecraft.client.gui.components.AbstractSliderButton ${comp.id};`);
        
        const sliderTitle = comp.text || "Slider";
        const isPrefix = comp.isTextPrefix !== false;
        const fmt = comp.formatNumber || 'x';

        let javaMessageExpression = "";
        if (!isPrefix) {
            javaMessageExpression = `Component.literal("${sliderTitle}")`;
        } else {
            let valCalculation = `this.value * ${comp.maxVal}`;
            if (fmt === 'x') {
                javaMessageExpression = `Component.literal("${sliderTitle}: " + (int)(${valCalculation}))`;
            } else if (fmt === 'x.x') {
                javaMessageExpression = `Component.literal("${sliderTitle}: " + String.format(java.util.Locale.US, "%.1f", ${valCalculation}))`;
            } else if (fmt === 'x.xx') {
                javaMessageExpression = `Component.literal("${sliderTitle}: " + String.format(java.util.Locale.US, "%.2f", ${valCalculation}))`;
            } else if (fmt === 'x.xxx') {
                javaMessageExpression = `Component.literal("${sliderTitle}: " + String.format(java.util.Locale.US, "%.3f", ${valCalculation}))`;
            }
        }

        if (comp.useCustomTextures && comp.sliderTrackTex && comp.sliderThumbTex) {
            const trackRes = `net.minecraft.resources.ResourceLocation.parse("${comp.sliderTrackTex}")`;
            const thumbRes = `net.minecraft.resources.ResourceLocation.parse("${comp.sliderThumbTex}")`;
            const thumbW = comp.sliderThumbWidth || 8;

            componentInitString = `new net.minecraft.client.gui.components.AbstractSliderButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.literal("${sliderTitle}"), ${comp.currentVal / comp.maxVal}) {\n` +
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
            componentInitString = `new net.minecraft.client.gui.components.AbstractSliderButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.literal("${sliderTitle}"), ${comp.currentVal / comp.maxVal}) {\n            @Override protected void updateMessage() { this.setMessage(${javaMessageExpression}); }\n            @Override protected void applyValue() { /* Tracking code */ }\n        }`;
        }
        
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Slider Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'ProgressBar':
        fields.push(`    private net.minecraft.client.gui.components.AbstractWidget ${comp.id};`);
        const barColor = comp.color || "0xFF10B981";
        const bgBarColor = comp.bgColor || "0xFF3F3F46";

        componentInitString = `new net.minecraft.client.gui.components.AbstractWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.empty()) {\n` +
        `            private float min = ${comp.minVal}f;\n` +
        `            private float max = ${comp.maxVal}f;\n` +
        `            private float val = ${comp.currentVal}f;\n\n` +
        `            @Override\n` +
        `            public void renderWidget(net.minecraft.client.gui.GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {\n` +
        `                float progress = Math.max(0.0f, Math.min(1.0f, (val - min) / (max - min)));\n` +
        `                int fgWidth = (int)(this.width * progress);\n` +
        `                guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height, (int) Long.parseLong("${bgBarColor}".replace("0x", ""), 16));\n` +
        `                if (fgWidth > 0) {\n` +
        `                    guiGraphics.fill(this.getX(), this.getY(), this.getX() + fgWidth, this.getY() + this.height, (int) Long.parseLong("${barColor}".replace("0x", ""), 16));\n` +
        `                }\n` +
        `            }\n` +
        `            @Override protected void updateWidgetNarration(net.minecraft.client.gui.narration.NarrationElementOutput output) {}\n` +
        `        }`;

        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Progress Bar: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'ImageButton':
        fields.push(`    private net.minecraft.client.gui.components.ImageButton ${comp.id};`);
        componentInitString = `new net.minecraft.client.gui.components.ImageButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, new net.minecraft.client.gui.components.WidgetSprites(net.minecraft.resources.ResourceLocation.parse("${comp.texture || 'pondertestgui:textures/gui/widgets.png'}")), button -> {\n            // Click Action\n        })`;
        
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // Image Button: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'EditBox':
        fields.push(`    private net.minecraft.client.gui.components.EditBox ${comp.id};`);
        componentInitString = `new net.minecraft.client.gui.components.EditBox(this.font, ${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.literal("${comp.placeholder}"))`;
        
        if (comp.parentId) {
            if (!scrollPanelChildrenMap[comp.parentId]) scrollPanelChildrenMap[comp.parentId] = [];
            scrollPanelChildrenMap[comp.parentId].push(`        this.${comp.id} = ${componentInitString};\n        this.${comp.id}.setHint(Component.literal("${comp.placeholder}"));\n        this.${comp.parentId}.addWidget(this.${comp.id});`);
        } else {
            initCode.push(`        // EditBox: ${comp.id}\n        this.${comp.id} = ${componentInitString};\n        this.addRenderableWidget(this.${comp.id});`);
        }
        break;

      case 'Image':
        if (comp.parentId) {
            renderBgCode.push(`        // Static Image (Inside ScrollPanel ${comp.parentId}): ${comp.id}`);
        } else {
            renderBgCode.push(`        // Static Image: ${comp.id}\n        guiGraphics.blit(net.minecraft.resources.ResourceLocation.parse("${comp.texture || 'pondertestgui:textures/gui/custom_image.png'}"), ${posX}, ${posY}, 0, 0, ${comp.width}, ${comp.height}, ${comp.width}, ${comp.height});`);
        }
        break;

      case 'InputSlot':
        initCode.push(`        // Slot input: ${comp.id} registered via Menu at relative X: ${comp.x}, Y: ${comp.y}`);
        break;

      case 'OutputSlot':
        initCode.push(`        // Slot output: ${comp.id} auto-centered via Menu at relative X: ${comp.x + 4}, Y: ${comp.y + 4}`);
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

  let mouseListenersCode = "";
  let scrollCalls = scrollPanelIds.map(id => `        if (this.${id}.mouseScrolled(mouseX, mouseY, scrollX, scrollY)) return true;`).join('\n');
  let clickCalls = scrollPanelIds.map(id => `        if (this.${id}.mouseClicked(mouseX, mouseY, button)) { this.setFocused(this.${id}); return true; }`).join('\n');
  let releaseCalls = scrollPanelIds.map(id => `        if (this.${id}.mouseReleased(mouseX, mouseY, button)) return true;`).join('\n');
  let dragCalls = scrollPanelIds.map(id => `        if (this.${id}.mouseDragged(mouseX, mouseY, button, dragX, dragY)) return true;`).join('\n');

  mouseListenersCode = `
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
    }`;

  let labelsHideCode = "";
  if (!hasPlayerInv) {
      labelsHideCode = `\n        this.titleLabelX = 99999;\n        this.inventoryLabelX = 99999;`;
  }

  const screenCode = `package com.${guiConfig.modId}.client.gui;

import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.item.ItemStack;
import com.${guiConfig.modId}.world.inventory.${menuClassName};

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