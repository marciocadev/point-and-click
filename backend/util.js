export const _generateRandomHexcolor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export const _generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
}