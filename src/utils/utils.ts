// Drawer：根据屏幕宽获取column数量
export const getDrawerWidth = () => {
  const { width } = window.screen;
  return width <= 640 ? { width: width * 0.8, column: 1 } : { width: 640, column: 2 };
};

// Map 转 Array，适用于select等组件
export const mapToArrayLabel = <T extends { label: string; value: string }>(
  map: Map<string, string>,
) => {
  let list: T[] = [];
  map.forEach((label, value) => {
    list = list.concat({ label, value } as T);
  });

  return list;
};
