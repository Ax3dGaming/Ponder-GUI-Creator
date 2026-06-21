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
        fields.push(`    private java.util.UUID targetUUID_${comp.id} = null;`);
        fields.push(`    private void createDummyPlayer_${comp.id}(com.mojang.authlib.GameProfile profile) {
        if (this.minecraft.level != null) {
            this.dummyPlayer_${comp.id} = new net.minecraft.client.player.RemotePlayer(this.minecraft.level, profile) {
                private net.minecraft.resources.ResourceLocation lastSkinTexture = null;
                @Override
                public net.minecraft.client.resources.PlayerSkin getSkin() {
                    net.minecraft.client.resources.PlayerSkin skin = net.minecraft.client.Minecraft.getInstance().getSkinManager().getInsecureSkin(this.getGameProfile());
                    if (skin != null && !skin.texture().equals(lastSkinTexture)) {
                        lastSkinTexture = skin.texture();
                    }
                    return skin;
                }
                @Override
                public boolean isModelPartShown(net.minecraft.world.entity.player.PlayerModelPart part) {
                    return true;
                }
            };
        }
    }`);

        renderLogic = `
            String currentTarget_${comp.id} = String.valueOf(${javaTarget});

            if (!currentTarget_${comp.id}.equals(this.lastTarget_${comp.id})) {
                this.lastTarget_${comp.id} = currentTarget_${comp.id};
                this.dummyPlayer_${comp.id} = null;

                if (${comp.isUuid}) {
                    try {
                        this.targetUUID_${comp.id} = java.util.UUID.fromString(currentTarget_${comp.id});
                        net.minecraft.client.multiplayer.PlayerInfo playerInfo = this.minecraft.getConnection().getPlayerInfo(this.targetUUID_${comp.id});

                        if (playerInfo != null) {
                            createDummyPlayer_${comp.id}(playerInfo.getProfile());
                        } else {
                            final java.util.UUID finalUUID = this.targetUUID_${comp.id};
                            java.util.concurrent.CompletableFuture.supplyAsync(() -> {
                                try {
                                    String uuidStr = finalUUID.toString().replace("-", "");
                                    java.net.URL url = new java.net.URL("https://sessionserver.mojang.com/session/minecraft/profile/" + uuidStr + "?unsigned=false");
                                    java.io.InputStreamReader reader = new java.io.InputStreamReader(url.openStream());
                                    com.google.gson.JsonObject json = com.google.gson.JsonParser.parseReader(reader).getAsJsonObject();
                                    reader.close();

                                    String name = json.has("name") ? json.get("name").getAsString() : "Dummy";
                                    com.mojang.authlib.GameProfile tempProfile = new com.mojang.authlib.GameProfile(finalUUID, name);

                                    if (json.has("properties")) {
                                        for (com.google.gson.JsonElement element : json.getAsJsonArray("properties")) {
                                            com.google.gson.JsonObject prop = element.getAsJsonObject();
                                            String propName = prop.get("name").getAsString();
                                            String propValue = prop.get("value").getAsString();
                                            String propSignature = prop.has("signature") ? prop.get("signature").getAsString() : null;
                                            tempProfile.getProperties().put(propName, new com.mojang.authlib.properties.Property(propName, propValue, propSignature));
                                        }
                                    }
                                    return tempProfile;
                                } catch (Exception e) {
                                    return new com.mojang.authlib.GameProfile(finalUUID, "Dummy");
                                }
                            }).thenAcceptAsync(filledProfile -> {
                                if (currentTarget_${comp.id}.equals(this.lastTarget_${comp.id})) {
                                    createDummyPlayer_${comp.id}(filledProfile);
                                }
                            }, this.minecraft);
                        }
                    } catch (Exception e) {
                        this.targetUUID_${comp.id} = java.util.UUID.randomUUID();
                    }
                } else {
                    this.targetUUID_${comp.id} = java.util.UUID.randomUUID();
                    createDummyPlayer_${comp.id}(new com.mojang.authlib.GameProfile(this.targetUUID_${comp.id}, currentTarget_${comp.id}));
                }
            }

            if (this.dummyPlayer_${comp.id} != null) {
                net.minecraft.client.gui.screens.inventory.InventoryScreen.renderEntityInInventoryFollowsMouse(guiGraphics, ${posX} - (${comp.width} / 2), ${posY} - ${comp.height}, ${posX} + (${comp.width} / 2), ${posY}, ${comp.scale}, 0.0625F, mouseX, mouseY, this.dummyPlayer_${comp.id});
            } else {
                java.util.UUID fallbackUuid_${comp.id} = this.targetUUID_${comp.id} != null ? this.targetUUID_${comp.id} : java.util.UUID.randomUUID();
                guiGraphics.blit(net.minecraft.client.resources.DefaultPlayerSkin.get(fallbackUuid_${comp.id}).texture(), ${posX} - (${comp.width} / 2), ${posY} - ${comp.height}, 32, 32, ${comp.width}, ${comp.height}, 256, 256);
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
