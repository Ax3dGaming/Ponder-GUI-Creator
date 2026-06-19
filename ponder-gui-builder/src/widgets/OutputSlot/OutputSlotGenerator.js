export const OutputSlotGenerator = {
  generateJava: (comp) => {
    return {
      fields: [],
      initCode: [`        // Slot output: ${comp.id} registered via Menu at relative X: ${comp.x}, Y: ${comp.y}`],
      renderBgCode: [],
      scrollChildrenCode: []
    };
  }
};
