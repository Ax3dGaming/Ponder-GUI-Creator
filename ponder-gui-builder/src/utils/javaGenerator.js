// --- SCRIPT DE GÉNÉRATION DU CONTAINER MENU (SERVEUR) ---
const generateMenuCode = (guiConfig, slots) => {
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
        super(null, containerId); // Needs RegistryObject type replacement
        this.container = container;
        checkContainerSize(container, ${slots.length});
        container.startOpen(playerInventory.player);

        // --- GENERATED SLOTS REGISTERING ---
${slotRegistrations.join('\n')}
        // ------------------------------------

        // Player Inventory layout slots
        for (int si = 0; si < 3; ++si) {
            for (int sj = 0; sj < 9; ++sj) {
                this.addSlot(new Slot(playerInventory, sj + si * 9 + 9, 8 + sj * 18, 84 + si * 18));
            }
        }
        // Player Hotbar layout slots
        for (int si = 0; si < 9; ++si) {
            this.addSlot(new Slot(playerInventory, si, 8 + si * 18, 142));
        }
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

// --- MÉTHODE DE GÉNÉRATION PRINCIPALE (SCREEN ET DISTRIBUTEUR COUPLÉ) ---
export const generateJavaCode = (guiConfig, components) => {
  const slots = components.filter(c => c.type.includes('Slot'));
  const hasSlots = slots.length > 0;
  
  const menuClassName = `${guiConfig.className}Menu`;
  const baseClass = hasSlots ? `AbstractContainerScreen<${menuClassName}>` : `Screen`;

  let fields = [];
  let initCode = [];
  let renderBgCode = [];

  if (guiConfig.backgroundType === "VANILLA_DARK") {
      renderBgCode.push(`        this.renderBackground(guiGraphics, mouseX, mouseY, partialTick);`);
  } else if (guiConfig.backgroundType === "CONTAINER") {
      renderBgCode.push(`        guiGraphics.blit(net.minecraft.resources.ResourceLocation.withDefaultNamespace("textures/gui/container/dispenser.png"), this.leftPos, this.topPos, 0, 0, 176, 166);`);
  } else if (guiConfig.backgroundType === "CUSTOM") {
      renderBgCode.push(`        guiGraphics.blit(net.minecraft.resources.ResourceLocation.parse("${guiConfig.customTexture}"), this.leftPos, this.topPos, 0, 0, ${guiConfig.bgWidth}, ${guiConfig.bgHeight});`);
  }

  components.forEach(comp => {
    const posX = hasSlots ? `this.leftPos + ${comp.x}` : `${comp.x}`;
    const posY = hasSlots ? `this.topPos + ${comp.y}` : `${comp.y}`;

    switch (comp.type) {
      case 'Label':
        initCode.push(`        // Label: ${comp.id}\n        this.addRenderableOnly(new net.minecraft.client.gui.components.StringWidget(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.literal("${comp.text}"), this.font).setColor(${comp.color || '0xFFFFFF'}));`);
        break;

      case 'Button':
        fields.push(`    private Button ${comp.id};`);
        initCode.push(`        // Button: ${comp.id}\n        this.${comp.id} = Button.builder(Component.literal("${comp.text}"), button -> {\n            // Click Action\n        }).bounds(${posX}, ${posY}, ${comp.width}, ${comp.height}).build();\n        this.addRenderableWidget(this.${comp.id});`);
        break;

      case 'Slider':
        fields.push(`    private net.minecraft.client.gui.components.AbstractSliderButton ${comp.id};`);
        initCode.push(`        // Slider Button: ${comp.id}\n        this.${comp.id} = new net.minecraft.client.gui.components.AbstractSliderButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.literal("${comp.text}"), ${comp.currentVal / comp.maxVal}) {\n            @Override protected void updateMessage() { this.setMessage(Component.literal("${comp.text}: " + (this.value * ${comp.maxVal}))); }\n            @Override protected void applyValue() { /* Bounds: ${comp.minVal} to ${comp.maxVal} */ }\n        };\n        this.addRenderableWidget(this.${comp.id});`);
        break;

      case 'ImageButton':
        fields.push(`    private ImageButton ${comp.id};`);
        initCode.push(`        // Image Button: ${comp.id}\n        this.${comp.id} = new ImageButton(${posX}, ${posY}, ${comp.width}, ${comp.height}, new net.minecraft.client.gui.components.WidgetSprites(net.minecraft.resources.ResourceLocation.parse("${comp.texture}")), button -> {\n            // Click Action\n        });\n        this.addRenderableWidget(this.${comp.id});`);
        break;

      case 'Image':
        renderBgCode.push(`        // Static Image: ${comp.id}\n        guiGraphics.blit(net.minecraft.resources.ResourceLocation.parse("${comp.texture || 'ponder:textures/gui/custom_image.png'}"), ${posX}, ${posY}, 0, 0, ${comp.width}, ${comp.height}, ${comp.width}, ${comp.height});`);
        break;

      case 'EditBox':
        fields.push(`    private EditBox ${comp.id};`);
        initCode.push(`        // EditBox: ${comp.id}\n        this.${comp.id} = new EditBox(this.font, ${posX}, ${posY}, ${comp.width}, ${comp.height}, Component.literal("${comp.placeholder}"));\n        this.${comp.id}.setHint(Component.literal("${comp.placeholder}"));\n        this.addRenderableWidget(this.${comp.id});`);
        break;

      case 'InputSlot':
      case 'OutputSlot':
        initCode.push(`        // Slot: ${comp.id} is managed via ${menuClassName} at relative X: ${comp.x}, Y: ${comp.y}`);
        break;

      case 'ScrollPanel':
        initCode.push(`        // ScrollPanel: ${comp.id} Layout (W: ${comp.width}, H: ${comp.height})`);
        break;
    }
  });

  const screenCode = `package com.${guiConfig.modId}.client.gui;

import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.components.EditBox;
import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Inventory;
import com.${guiConfig.modId}.world.inventory.${menuClassName};

public class ${guiConfig.className}Screen extends ${baseClass} {

${fields.join('\n')}

    public ${guiConfig.className}Screen(${hasSlots ? menuClassName + ' menu, Inventory playerInv, Component title' : ''}) {
        super(${hasSlots ? 'menu, playerInv, title' : 'Component.literal("' + guiConfig.guiTitle + '")'});
        ${hasSlots ? `this.imageWidth = ${guiConfig.bgWidth || 176};\n        this.imageHeight = ${guiConfig.bgHeight || 166};` : ''}
    }

    @Override
    protected void init() {
        ${hasSlots ? 'super.init();' : ''}
        ${hasSlots ? 'this.leftPos = (this.width - this.imageWidth) / 2;\n        this.topPos = (this.height - this.imageHeight) / 2;' : ''}
        ${!hasSlots ? 'super.init();' : ''}

        // --- GENERATED WIDGETS ---
${initCode.join('\n')}
        // -------------------------
    }

    @Override
    public void render(GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {
        ${hasSlots ? 'super.render(guiGraphics, mouseX, mouseY, partialTick);' : 'this.renderBackground(guiGraphics, mouseX, mouseY, partialTick);'}
        ${!hasSlots ? 'super.render(guiGraphics, mouseX, mouseY, partialTick);' : ''}
        ${hasSlots ? 'this.renderTooltip(guiGraphics, mouseX, mouseY);' : ''}
    }

    @Override
    protected void renderBg(GuiGraphics guiGraphics, float partialTick, int mouseX, int mouseY) {
${renderBgCode.join('\n')}
    }

    @Override
    public boolean isPauseScreen() {
        return false;
    }
}`;

  if (hasSlots) {
    return {
      type: "CONTAINER",
      screenFileName: `${guiConfig.className}Screen.java`,
      screenCode: screenCode,
      menuFileName: `${guiConfig.className}Menu.java`,
      menuCode: generateMenuCode(guiConfig, slots)
    };
  }

  return {
    type: "STANDARD",
    screenFileName: `${guiConfig.className}Screen.java`,
    screenCode: screenCode
  };
};