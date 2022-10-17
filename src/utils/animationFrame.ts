const ids: number[] = [];
export async function waitAnimationFrame(
  isFreeze: boolean = false
): Promise<number> {
  return new Promise<number>((resolve) => {
    const id = requestAnimationFrame(resolve);
    ids.push(id);
    if (isFreeze) {
      ids.forEach((id) => cancelAnimationFrame(id));
    }
    return id;
  });
}
