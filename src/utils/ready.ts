export const ready = (process: () => void) => {
  window.addEventListener("load", process);
};
