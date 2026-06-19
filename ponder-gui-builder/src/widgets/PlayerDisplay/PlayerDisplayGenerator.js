export const PlayerDisplayGenerator = {
  generateJava: (comp) => {
    const fields = [];
    const initCode = [];
    const renderBgCode = [];
    const scrollChildrenCode = [];

    const posX = comp.parentId ? `${comp.x} + (this.width / 2)` : `this.leftPos + ${comp.x} + (${comp.width} / 2)`;
    const posY = comp.parentId ? `${comp.y} + this.height` : `this.topPos + ${comp.y} + ${comp.height}`;

    let renderLogic = ``;

    if (!comp.isUuid && (comp.targetPlayer === '%player_name%' || !comp.targetPlayer)) {
        renderLogic = `net.minecraft.client.gui.screens.inventory.InventoryScreen.renderEntityInInventoryFollowsMouse(guiGraphics, ${posX} - (${comp.width} / 2), ${posY} - ${comp.height}, ${posX} + (${comp.width} / 2), ${posY}, ${comp.scale}, 0.0625F, mouseX, mouseY, this.minecraft.player);`;
    } else {
        // Data-bound UUID or String parsing
        const targetString = comp.targetPlayer || '""';
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
        } else if (targetString.startsWith('%') && targetString.endsWith('%')) {
             javaTarget = `String.valueOf(1)`; 
        }

        fields.push(`    private net.minecraft.client.player.RemotePlayer dummyPlayer_${comp.id};`);
        fields.push(`    private String lastTarget_${comp.id} = "";`);

        renderLogic = `
            String currentTarget_${comp.id} = String.valueOf(${javaTarget});
            if (!currentTarget_${comp.id}.equals(this.lastTarget_${comp.id}) || this.dummyPlayer_${comp.id} == null) {
                this.lastTarget_${comp.id} = currentTarget_${comp.id};
                com.mojang.authlib.GameProfile profile = null;
                if (${comp.isUuid}) {
                    try {
                        profile = new com.mojang.authlib.GameProfile(java.util.UUID.fromString(currentTarget_${comp.id}), "Dummy");
                    } catch (Exception e) {}
                } else {
                    net.minecraft.client.multiplayer.PlayerInfo playerInfo = this.minecraft.getConnection().getPlayerInfo(currentTarget_${comp.id});
                    if (playerInfo != null) profile = playerInfo.getProfile();
                    else profile = new com.mojang.authlib.GameProfile(java.util.UUID.randomUUID(), currentTarget_${comp.id});
                }
                if (profile != null && this.minecraft.level != null) {
                    this.dummyPlayer_${comp.id} = new net.minecraft.client.player.RemotePlayer(this.minecraft.level, profile);
                } else {
                    this.dummyPlayer_${comp.id} = null;
                }
            }
            
            if (this.dummyPlayer_${comp.id} != null) {
                net.minecraft.client.gui.screens.inventory.InventoryScreen.renderEntityInInventoryFollowsMouse(guiGraphics, ${posX} - (${comp.width} / 2), ${posY} - ${comp.height}, ${posX} + (${comp.width} / 2), ${posY}, ${comp.scale}, 0.0625F, mouseX, mouseY, this.dummyPlayer_${comp.id});
            } else {
                guiGraphics.blit(net.minecraft.client.resources.DefaultPlayerSkin.getDefaultTexture(), ${posX} - (${comp.width} / 2), ${posY} - ${comp.height}, 32, 32, ${comp.width}, ${comp.height}, 256, 256);
            }
        `;
    }

    if (comp.parentId) {
        scrollChildrenCode.push(renderLogic);
    } else {
        renderBgCode.push(`        ${renderLogic}`);
    }

    return { fields, initCode, renderBgCode, scrollChildrenCode };
  }
};
