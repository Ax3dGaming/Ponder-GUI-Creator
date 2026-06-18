export const generateScrollPanelWidgetCode = (widgetPackage) => {
    return `package ${widgetPackage};

import net.minecraft.client.Minecraft;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.api.distmarker.OnlyIn;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.AbstractWidget;
import net.minecraft.client.gui.components.Renderable;
import net.minecraft.client.gui.components.events.GuiEventListener;
import net.minecraft.client.gui.narration.NarrationElementOutput;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import java.util.ArrayList;
import java.util.List;

@OnlyIn(Dist.CLIENT)
public class ScrollPanelWidget extends AbstractWidget implements Renderable, GuiEventListener {
    private final List<AbstractWidget> children = new ArrayList<>();
    private final int maxContentHeight;
    private final int maxContentWidth;
    private final boolean allowXScroll;
    private final boolean allowYScroll;
    private final boolean showBorder;
    private final int borderColor;
    private double scrollAmountX = 0;
    private double scrollAmountY = 0;
    private double targetScrollX = 0;
    private double targetScrollY = 0;
    private boolean isDraggingY = false;
    private boolean isDraggingX = false;
    private GuiEventListener focusedChild = null;

    private ResourceLocation vBarTex = null;
    private ResourceLocation vThumbTex = null;
    private ResourceLocation hBarTex = null;
    private ResourceLocation hThumbTex = null;
    private ResourceLocation backgroundTexture = null;

    public ScrollPanelWidget(int x, int y, int width, int height, int maxContentWidth, int maxContentHeight, boolean allowXScroll, boolean allowYScroll, boolean showBorder, int borderColor) {
        super(x, y, width, height, Component.empty());
        this.maxContentWidth = maxContentWidth;
        this.maxContentHeight = maxContentHeight;
        this.allowXScroll = allowXScroll;
        this.allowYScroll = allowYScroll;
        this.showBorder = showBorder;
        this.borderColor = borderColor;
    }

    public void setVerticalScrollTextures(String bar, String thumb) {
        if (!bar.isEmpty()) this.vBarTex = ResourceLocation.parse(bar);
        if (!thumb.isEmpty()) this.vThumbTex = ResourceLocation.parse(thumb);
    }

    public void setHorizontalScrollTextures(String bar, String thumb) {
        if (!bar.isEmpty()) this.hBarTex = ResourceLocation.parse(bar);
        if (!thumb.isEmpty()) this.hThumbTex = ResourceLocation.parse(thumb);
    }

    public void setBackgroundTexture(String tex) {
        if (tex != null && !tex.isEmpty()) {
            this.backgroundTexture = ResourceLocation.parse(tex);
        }
    }

    public void addWidget(AbstractWidget widget) { this.children.add(widget); }

    @Override
    public void renderWidget(GuiGraphics guiGraphics, int mouseX, int mouseY, float partialTick) {
        if (this.allowYScroll) {
            this.scrollAmountY += (this.targetScrollY - this.scrollAmountY) * 0.25f;
            if (Math.abs(this.scrollAmountY - this.targetScrollY) < 0.05) this.scrollAmountY = this.targetScrollY;
        }
        if (this.allowXScroll) {
            this.scrollAmountX += (this.targetScrollX - this.scrollAmountX) * 0.25f;
            if (Math.abs(this.scrollAmountX - this.targetScrollX) < 0.05) this.scrollAmountX = this.targetScrollX;
        }

        if (this.showBorder) {
            guiGraphics.fill(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height, 0x400F172A);
            guiGraphics.renderOutline(this.getX(), this.getY(), this.width, this.height, this.borderColor);
        }

        this.handleDragLogic(mouseX, mouseY);
        this.renderScrollBars(guiGraphics);

        if (this.width > 0 && this.height > 0) {
            guiGraphics.enableScissor(this.getX(), this.getY(), this.getX() + this.width, this.getY() + this.height);
            
            if (this.backgroundTexture != null) {
                guiGraphics.blit(this.backgroundTexture, this.getX(), this.getY(), 0, 0, this.width, this.height, this.width, this.height);
            }

            guiGraphics.pose().pushPose();
            guiGraphics.pose().translate(0, 0, 1.0f);

            for (AbstractWidget widget : children) {
                int relativeX = widget.getX();
                int relativeY = widget.getY();
                int absoluteX = (int) (this.getX() + relativeX - this.scrollAmountX);
                int absoluteY = (int) (this.getY() + relativeY - this.scrollAmountY);

                widget.setX(absoluteX);
                widget.setY(absoluteY);
                widget.render(guiGraphics, mouseX, mouseY, partialTick);

                widget.setX(relativeX);
                widget.setY(relativeY);
            }
            guiGraphics.pose().popPose();
            guiGraphics.disableScissor();
        }
    }

    private void renderScrollBars(GuiGraphics graphics) {
        if (this.allowYScroll && this.maxContentHeight > this.height && this.vBarTex != null && this.vThumbTex != null) {
            int barX = this.getX() + this.width - 10; int barY = this.getY(); int barW = 8; int barH = this.height;
            graphics.blit(this.vBarTex, barX, barY, 0, 0, barW, barH, barW, barH);
            double progressY = this.scrollAmountY / (this.maxContentHeight - this.height);
            int thumbH = Math.max(15, (int)((double)this.height * this.height / this.maxContentHeight));
            int thumbY = barY + (int)(progressY * (this.height - thumbH));
            graphics.blit(this.vThumbTex, barX, thumbY, 0, 0, barW, thumbH, barW, thumbH);
        }
        if (this.allowXScroll && this.maxContentWidth > this.width && this.hBarTex != null && this.hThumbTex != null) {
            int barX = this.getX(); int barY = this.getY() + this.height - 10; int barW = this.width; int barH = 8;
            graphics.blit(this.hBarTex, barX, barY, 0, 0, barW, barH, barW, barH);
            double progressX = this.scrollAmountX / (this.maxContentWidth - this.width);
            int thumbW = Math.max(15, (int)((double)this.width * this.width / this.maxContentWidth));
            int thumbX = barX + (int)(progressX * (this.width - thumbW));
            graphics.blit(this.hThumbTex, thumbX, barY, 0, 0, thumbW, barH, thumbW, barH);
        }
    }

    private void handleDragLogic(double mouseX, double mouseY) {
        if (this.isDraggingY) {
            int thumbH = Math.max(15, (int)((double)this.height * this.height / this.maxContentHeight));
            double delta = (mouseY - this.getY() - (thumbH / 2.0)) / (this.height - thumbH);
            this.targetScrollY = Math.max(0, Math.min(delta * (this.maxContentHeight - this.height), this.maxContentHeight - this.height));
            this.scrollAmountY = this.targetScrollY;
        }
        if (this.isDraggingX) {
            int thumbW = Math.max(15, (int)((double)this.width * this.width / this.maxContentWidth));
            double delta = (mouseX - this.getX() - (thumbW / 2.0)) / (this.width - thumbW);
            this.targetScrollX = Math.max(0, Math.min(delta * (this.maxContentWidth - this.width), this.maxContentWidth - this.width));
            this.scrollAmountX = this.targetScrollX;
        }
    }

    @Override
    public boolean mouseScrolled(double mouseX, double mouseY, double scrollX, double scrollY) {
        if (this.isMouseOver(mouseX, mouseY)) {
            if (this.allowYScroll && this.maxContentHeight > this.height) {
                this.targetScrollY = Math.max(0, Math.min(this.targetScrollY - (scrollY * 16), this.maxContentHeight - this.height));
                return true;
            }
            if (this.allowXScroll && this.maxContentWidth > this.width) {
                double activeScroll = scrollY != 0 ? scrollY : scrollX;
                this.targetScrollX = Math.max(0, Math.min(this.targetScrollX - (activeScroll * 16), this.maxContentWidth - this.width));
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean mouseClicked(double mouseX, double mouseY, int button) {
        if (button == 0 && this.allowYScroll && mouseX >= this.getX() + this.width - 10 && mouseX <= this.getX() + this.width && mouseY >= this.getY() && mouseY <= this.getY() + this.height) {
            this.isDraggingY = true; return true;
        }
        if (button == 0 && this.allowXScroll && mouseX >= this.getX() && mouseX <= this.getX() + this.width && mouseY >= this.getY() + this.height - 10 && mouseY <= this.getY() + this.height) {
            this.isDraggingX = true; return true;
        }
        if (this.isMouseOver(mouseX, mouseY)) {
            for (AbstractWidget widget : children) {
                int relativeX = widget.getX();
                int relativeY = widget.getY();
                widget.setX((int) (this.getX() + relativeX - this.scrollAmountX));
                widget.setY((int) (this.getY() + relativeY - this.scrollAmountY));

                if (widget.mouseClicked(mouseX, mouseY, button)) {
                    this.focusedChild = widget;
                    widget.setX(relativeX);
                    widget.setY(relativeY);
                    return true;
                }
                widget.setX(relativeX);
                widget.setY(relativeY);
            }
        }
        return false;
    }

    @Override
    public boolean mouseDragged(double mouseX, double mouseY, int button, double dragX, double dragY) {
        if (this.isDraggingY || this.isDraggingX) { this.handleDragLogic(mouseX, mouseY); return true; }
        if (this.focusedChild != null && this.focusedChild instanceof AbstractWidget widget) {
            int relativeX = widget.getX(); int relativeY = widget.getY();
            widget.setX((int) (this.getX() + relativeX - this.scrollAmountX));
            widget.setY((int) (this.getY() + relativeY - this.scrollAmountY));
            if (widget.mouseDragged(mouseX, mouseY, button, dragX, dragY)) {
                widget.setX(relativeX); widget.setY(relativeY); return true;
            }
            widget.setX(relativeX); widget.setY(relativeY);
        }
        return false;
    }

    @Override
    public boolean mouseReleased(double mouseX, double mouseY, int button) {
        if (button == 0) { 
            this.isDraggingY = false; 
            this.isDraggingX = false;
            if (this.focusedChild != null) { this.focusedChild.mouseReleased(mouseX, mouseY, button); this.focusedChild = null; }
        }
        return super.mouseReleased(mouseX, mouseY, button);
    }

    @Override
    public boolean keyPressed(int keyCode, int scanCode, int modifiers) {
        if (this.focusedChild != null && this.focusedChild.keyPressed(keyCode, scanCode, modifiers)) {
            return true;
        }
        return super.keyPressed(keyCode, scanCode, modifiers);
    }

    @Override
    public boolean charTyped(char codePoint, int modifiers) {
        if (this.focusedChild != null && this.focusedChild.charTyped(codePoint, modifiers)) {
            return true;
        }
        return super.charTyped(codePoint, modifiers);
    }

    @Override protected void updateWidgetNarration(NarrationElementOutput output) {}
}`;
};