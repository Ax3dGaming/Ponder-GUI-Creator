import { LabelWidget } from './Label/Label';
import { LabelGenerator } from './Label/LabelGenerator';
import { ButtonWidget } from './Button/Button';
import { ButtonGenerator } from './Button/ButtonGenerator';
import { ImageButtonWidget } from './ImageButton/ImageButton';
import { ImageButtonGenerator } from './ImageButton/ImageButtonGenerator';
import { ImageWidget } from './Image/Image';
import { ImageGenerator } from './Image/ImageGenerator';
import { ItemDisplayWidget } from './ItemDisplay/ItemDisplay';
import { ItemDisplayGenerator } from './ItemDisplay/ItemDisplayGenerator';
import { EntityDisplayWidget } from './EntityDisplay/EntityDisplay';
import { EntityDisplayGenerator } from './EntityDisplay/EntityDisplayGenerator';
import { SliderWidget } from './Slider/Slider';
import { SliderGenerator } from './Slider/SliderGenerator';
import { ProgressBarWidget } from './ProgressBar/ProgressBar';
import { ProgressBarGenerator } from './ProgressBar/ProgressBarGenerator';
import { HoverAreaWidget } from './HoverArea/HoverArea';
import { HoverAreaGenerator } from './HoverArea/HoverAreaGenerator';
import { EditBoxWidget } from './EditBox/EditBox';
import { EditBoxGenerator } from './EditBox/EditBoxGenerator';
import { InputSlotWidget } from './InputSlot/InputSlot';
import { InputSlotGenerator } from './InputSlot/InputSlotGenerator';
import { OutputSlotWidget } from './OutputSlot/OutputSlot';
import { OutputSlotGenerator } from './OutputSlot/OutputSlotGenerator';
import { PlayerInventoryWidget } from './PlayerInventory/PlayerInventory';
import { PlayerInventoryGenerator } from './PlayerInventory/PlayerInventoryGenerator';
import { ScrollPanelWidget } from './ScrollPanel/ScrollPanel';
import { ScrollPanelGenerator } from './ScrollPanel/ScrollPanelGenerator';

const widgets = [
  { def: LabelWidget, gen: LabelGenerator },
  { def: ButtonWidget, gen: ButtonGenerator },
  { def: ImageButtonWidget, gen: ImageButtonGenerator },
  { def: ImageWidget, gen: ImageGenerator },
  { def: ItemDisplayWidget, gen: ItemDisplayGenerator },
  { def: EntityDisplayWidget, gen: EntityDisplayGenerator },
  { def: SliderWidget, gen: SliderGenerator },
  { def: ProgressBarWidget, gen: ProgressBarGenerator },
  { def: HoverAreaWidget, gen: HoverAreaGenerator },
  { def: EditBoxWidget, gen: EditBoxGenerator },
  { def: InputSlotWidget, gen: InputSlotGenerator },
  { def: OutputSlotWidget, gen: OutputSlotGenerator },
  { def: PlayerInventoryWidget, gen: PlayerInventoryGenerator },
  { def: ScrollPanelWidget, gen: ScrollPanelGenerator }
];

const registry = new Map();
const generators = new Map();

widgets.forEach(({ def, gen }) => {
  registry.set(def.type, def);
  generators.set(def.type, gen);
});

export const WidgetRegistry = {
  getTools: () => {
    return Array.from(registry.values()).map(def => ({
      type: def.type,
      label: def.label,
      defaultWidth: def.defaultWidth,
      defaultHeight: def.defaultHeight
    }));
  },

  getWidget: (type) => registry.get(type),

  getInitialProps: (type) => {
    const widget = registry.get(type);
    return widget && widget.createInitialProps ? widget.createInitialProps() : {};
  },

  renderCanvas: (type, props) => {
    const widget = registry.get(type);
    if (!widget || !widget.renderCanvas) return null;
    return widget.renderCanvas(props);
  },

  renderInspector: (type, props) => {
    const widget = registry.get(type);
    if (!widget || !widget.renderInspector) return null;
    return widget.renderInspector(props);
  },

  generateJava: (type, comp, context) => {
    const generator = generators.get(type);
    if (!generator || !generator.generateJava) return { fields: [], initCode: [], renderBgCode: [], scrollChildrenCode: [] };
    return generator.generateJava(comp, context);
  }
};
