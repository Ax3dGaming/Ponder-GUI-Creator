import { WidgetRegistry } from '../widgets/WidgetRegistry';
import { parsePlaceholdersJavaText, parsePlaceholdersJavaRaw } from '../placeholders/PlaceholderRegistry';

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
  
  const slotIndexMap = {};
  slots.forEach((slot, index) => {
      slotIndexMap[slot.id] = index;
  });
  
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
  let tickCode = [];

  const getTextComponent = (comp) => {
      if (comp.isTranslatable) return `Component.translatable("${comp.text}")`;
      return parsePlaceholdersJavaText(comp.text);
  };

  const getButtonActionCode = (comp) => {
      if (comp.actionType === 'OPEN_SCREEN' && comp.actionTarget) {
          return `net.minecraft.client.Minecraft.getInstance().setScreen(new ${comp.actionTarget}(/* TODO: Add required constructor arguments */));`;
      } else if (comp.actionType === 'CLOSE_SCREEN') {
          return `this.onClose();`;
      } else if (comp.actionType === 'PRINT_CONSOLE' && comp.actionTarget) {
          return `System.out.println("${comp.actionTarget.replace(/"/g, '\\"')}");`;
      } else if (comp.actionType === 'PLAY_SOUND') {
          const soundTarget = comp.actionTarget ? `net.minecraft.sounds.SoundEvent.createVariableRangeEvent(net.minecraft.resources.ResourceLocation.parse("${comp.actionTarget}"))` : `net.minecraft.sounds.SoundEvents.UI_BUTTON_CLICK.value()`;
          return `net.minecraft.client.Minecraft.getInstance().getSoundManager().play(net.minecraft.client.resources.sounds.SimpleSoundInstance.forUI(${soundTarget}, 1.0F));`;
      } else if (comp.actionType === 'OPEN_URL' && comp.actionTarget) {
          return `net.minecraft.client.Minecraft.getInstance().setScreen(new net.minecraft.client.gui.screens.ConfirmLinkScreen(open -> { if (open) net.minecraft.Util.getPlatform().openUri("${comp.actionTarget}"); this.minecraft.setScreen(this); }, "${comp.actionTarget}", true));`;
      } else if (comp.actionType === 'TOGGLE_VISIBILITY' && comp.actionTarget) {
          return `if (this.${comp.actionTarget} != null) this.${comp.actionTarget}.visible = !this.${comp.actionTarget}.visible;`;
      } else if (comp.actionType === 'SEND_PACKET') {
          return `// TODO: Send packet to server\n            // ModMessages.sendToServer(new ${comp.actionTarget || 'CustomPacket'}());`;
      } else if (comp.actionType === 'EXECUTE_COMMAND') {
          const targetString = comp.actionTarget || '';
          let javaTarget = `"${targetString}"`;
          if (targetString.includes('${')) {
              javaTarget = `""`;
              const parts = targetString.split(/(\\$\\{[^}]+\\})/g);
              const appendChain = parts.map(p => {
                  if (p.startsWith('${') && p.endsWith('}')) {
                      return `this.${p.substring(2, p.length - 1)}.getValue()`;
                  }
                  return `"${p}"`;
              }).filter(p => p !== '""').join(' + ');
              if (appendChain) javaTarget = appendChain;
          }
          return `if (this.minecraft.player != null) this.minecraft.player.connection.sendCommand(${javaTarget});`;
      } else if (comp.actionType === 'COPY_TO_CLIPBOARD') {
          const targetString = comp.actionTarget || '';
          let javaTarget = `"${targetString}"`;
          if (targetString.includes('${')) {
              javaTarget = `""`;
              const parts = targetString.split(/(\\$\\{[^}]+\\})/g);
              const appendChain = parts.map(p => {
                  if (p.startsWith('${') && p.endsWith('}')) {
                      return `this.${p.substring(2, p.length - 1)}.getValue()`;
                  }
                  return `"${p}"`;
              }).filter(p => p !== '""').join(' + ');
              if (appendChain) javaTarget = appendChain;
          }
          return `this.minecraft.keyboardHandler.setClipboard(${javaTarget});`;
      }
      return `// Click Action`;
  };

    const getEffectiveCoords = (c) => {
        let x = c.x, y = c.y, pId = c.parentId;
        while (pId) {
            const p = components.find(o => o.id === pId);
            if (!p) break;
            if (p.type === 'ScrollPanel') break;
            x += p.x; y += p.y;
            pId = p.parentId;
        }
        return { x, y, effectiveParentId: pId };
    };

  components.forEach(comp => {
    if (comp.type === 'ScrollPanel' || comp.type === 'Group') return;

    const eff = getEffectiveCoords(comp);
    const effComp = { ...comp, x: eff.x, y: eff.y, parentId: eff.effectiveParentId };

    const context = { guiConfig, getTextComponent, getButtonActionCode, slotIndexMap };
    const result = WidgetRegistry.generateJava(effComp.type, effComp, context);
    
    let conditionWrapOpen = "";
    let conditionWrapClose = "";

    if (effComp.conditionOp || effComp.conditionCreative || effComp.conditionItem) {
        const checks = [];
        if (effComp.conditionOp) checks.push("this.minecraft.player.hasPermissions(2)");
        if (effComp.conditionCreative) checks.push("this.minecraft.player.getAbilities().instabuild");
        if (effComp.conditionItem) checks.push(`this.minecraft.player.getInventory().contains(new net.minecraft.world.item.ItemStack(net.minecraft.core.registries.BuiltInRegistries.ITEM.getValue(net.minecraft.resources.ResourceLocation.parse("${effComp.conditionItem}"))))`);
        
        if (checks.length > 0) {
            conditionWrapOpen = `if (${checks.join(" && ")}) {`;
            conditionWrapClose = `}`;
        }
    }

    if (effComp.comment) {
        fields.push(`    // ${effComp.comment}`);
    }
    if (result.fields) fields.push(...result.fields);
    
    if (result.initCode && result.initCode.length > 0) {
        if (effComp.comment) {
            initCode.push(`        // ${effComp.comment}`);
        }
        if (conditionWrapOpen) initCode.push(`        ${conditionWrapOpen}`);
        initCode.push(...result.initCode.map(line => conditionWrapOpen ? `    ${line}` : line));
        if (conditionWrapClose) initCode.push(`        ${conditionWrapClose}`);
    }

    if (result.renderBgCode && result.renderBgCode.length > 0) {
        if (conditionWrapOpen) renderBgCode.push(`        ${conditionWrapOpen}`);
        renderBgCode.push(...result.renderBgCode.map(line => conditionWrapOpen ? `    ${line}` : line));
        if (conditionWrapClose) renderBgCode.push(`        ${conditionWrapClose}`);
    }
    
    if (effComp.parentId && result.scrollChildrenCode && result.scrollChildrenCode.length > 0) {
      if (!scrollPanelChildrenMap[effComp.parentId]) scrollPanelChildrenMap[effComp.parentId] = [];
      if (effComp.comment) {
          scrollPanelChildrenMap[effComp.parentId].push(`        // ${effComp.comment}`);
      }
      if (conditionWrapOpen) scrollPanelChildrenMap[effComp.parentId].push(`        ${conditionWrapOpen}`);
      scrollPanelChildrenMap[effComp.parentId].push(...result.scrollChildrenCode.map(line => conditionWrapOpen ? `    ${line}` : line));
      if (conditionWrapClose) scrollPanelChildrenMap[effComp.parentId].push(`        ${conditionWrapClose}`);
    }

    if (effComp.hoverActionType && effComp.hoverActionType !== 'NONE') {
        fields.push(`    private boolean wasHovered_${effComp.id} = false;`);
        
        let hoverLogic = "";
        if (effComp.hoverActionType === 'PLAY_SOUND') {
            const soundTarget = effComp.hoverActionTarget ? `net.minecraft.sounds.SoundEvent.createVariableRangeEvent(net.minecraft.resources.ResourceLocation.parse("${effComp.hoverActionTarget}"))` : `net.minecraft.sounds.SoundEvents.UI_BUTTON_CLICK.value()`;
            hoverLogic = `net.minecraft.client.Minecraft.getInstance().getSoundManager().play(net.minecraft.client.resources.sounds.SimpleSoundInstance.forUI(${soundTarget}, 1.0F));`;
        } else if (effComp.hoverActionType === 'PRINT_CONSOLE') {
            hoverLogic = `System.out.println("${effComp.hoverActionTarget || 'Hovered!'}");`;
        }

        const posX = effComp.parentId ? `this.${effComp.parentId}.getX() + ${effComp.x}` : `this.leftPos + ${effComp.x}`;
        const posY = effComp.parentId ? `this.${effComp.parentId}.getY() + ${effComp.y} - (int)this.${effComp.parentId}.getScrollAmount()` : `this.topPos + ${effComp.y}`;
        
        const hCode = [
            `        if (mouseX >= ${posX} && mouseX <= ${posX} + ${effComp.width} && mouseY >= ${posY} && mouseY <= ${posY} + ${effComp.height}) {`,
            `            if (!this.wasHovered_${effComp.id}) {`,
            `                ${hoverLogic}`,
            `            }`,
            `            this.wasHovered_${effComp.id} = true;`,
            `        } else {`,
            `            this.wasHovered_${effComp.id} = false;`,
            `        }`
        ];
        
        if (effComp.parentId) {
            if (!scrollPanelChildrenMap[effComp.parentId]) scrollPanelChildrenMap[effComp.parentId] = [];
            scrollPanelChildrenMap[effComp.parentId].push(...hCode);
        } else {
            renderBgCode.push(...hCode);
        }
    }
    
    if (effComp.disabledIfEmpty) {
        tickCode.push(`        if (this.${effComp.id} != null && this.${effComp.disabledIfEmpty} != null) {`);
        tickCode.push(`            this.${effComp.id}.active = !this.${effComp.disabledIfEmpty}.getValue().isEmpty();`);
        tickCode.push(`        }`);
    }
  });

  components.forEach(comp => {
    if (comp.type === 'ScrollPanel') {
      const context = { guiConfig, scrollPanelChildrenMap };
      const result = WidgetRegistry.generateJava(comp.type, comp, context);
      
      if (result.fields) fields.push(...result.fields);
      if (result.initCode) initCode.push(...result.initCode);
      scrollPanelIds.push(comp.id);
    }
  });

  // GESTION MAGIQUE DES TOUCHES (Bloquer la touche E si une EditBox est sélectionnée)
  let editBoxIds = components.filter(c => c.type === 'EditBox').map(c => c.id);
  let editBoxChecks = editBoxIds.length > 0 ? editBoxIds.map(id => `this.${id} != null && this.${id}.isFocused()`).join(' || ') : 'false';

  let editBoxEnterChecks = components.filter(c => c.type === 'EditBox' && c.actionEvent === 'ON_ENTER').map(comp => {
      let actionLogic = "";
      if (comp.actionType === 'UPDATE_LABEL' && comp.actionTarget) {
          actionLogic = `if (this.${comp.actionTarget} != null) this.${comp.actionTarget}.setMessage(Component.literal(this.${comp.id}.getValue()));`;
      } else if (comp.actionType === 'PRINT_CONSOLE') {
          actionLogic = `System.out.println("${comp.id} value: " + this.${comp.id}.getValue());`;
      }
      if (actionLogic !== "") {
          return `            if (this.${comp.id} != null && this.${comp.id}.isFocused()) { ${actionLogic} return true; }`;
      }
      return "";
  }).filter(s => s !== "").join('\n');

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
        if (this.getFocused() != null && this.isDragging() && button == 0) {
            return this.getFocused().mouseDragged(mouseX, mouseY, button, dragX, dragY);
        }
        return super.mouseDragged(mouseX, mouseY, button, dragX, dragY);
    }

    @Override
    public boolean keyPressed(int keyCode, int scanCode, int modifiers) {
        boolean isEditBoxFocused = ${editBoxChecks};
        if (isEditBoxFocused) {
            if (keyCode == 257 || keyCode == 335) { // Enter or Numpad Enter
${editBoxEnterChecks}
            }
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

  let combinedTickCode = [...tickCode];
  if (guiConfig.onTickCode) {
      combinedTickCode.push(...guiConfig.onTickCode.split('\n'));
  }
  let tickMethodCode = combinedTickCode.length > 0 ? `\n    @Override\n    public void containerTick() {\n        super.containerTick();\n${combinedTickCode.map(l => `        ${l}`).join('\n')}\n    }\n` : '';

  let closeMethodCode = guiConfig.onCloseCode ? `\n    @Override\n    public void onClose() {\n${guiConfig.onCloseCode.split('\n').map(l => `        ${l}`).join('\n')}\n        super.onClose();\n    }\n` : '';

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

${guiConfig.onInitActionType === 'PLAY_SOUND' ? `        net.minecraft.client.Minecraft.getInstance().getSoundManager().play(net.minecraft.client.resources.sounds.SimpleSoundInstance.forUI(${guiConfig.onInitActionTarget ? `net.minecraft.sounds.SoundEvent.createVariableRangeEvent(net.minecraft.resources.ResourceLocation.parse("${guiConfig.onInitActionTarget}"))` : `net.minecraft.sounds.SoundEvents.UI_BUTTON_CLICK.value()`}, 1.0F));\n` : ''}${guiConfig.onInitActionType === 'SEND_PACKET' ? `        // TODO: Send init packet to server\n        // ModMessages.sendToServer(new ${guiConfig.onInitActionTarget || 'CustomInitPacket'}());\n` : ''}
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
${tickMethodCode}${closeMethodCode}
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