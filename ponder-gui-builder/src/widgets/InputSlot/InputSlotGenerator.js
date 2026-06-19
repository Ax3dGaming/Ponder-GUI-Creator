export const InputSlotGenerator = {
  generateJava: (comp) => {
    return {
      fields: [],
      initCode: [`        // Slot input: ${comp.id} registered via Menu at relative X: ${comp.x}, Y: ${comp.y}`],
      renderBgCode: [],
      scrollChildrenCode: []
    };
  }
};
