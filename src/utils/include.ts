export async function include(
  filePath: string,
  insertSelector: string
): Promise<void> {
  const result = await (await fetch(filePath)).text();
  console.log(result);
  const element = document.querySelector(insertSelector);
  if (!element)
    throw new Error(
      `insertSelector(${insertSelector})で要素が取れませんでした @function include/include.ts`
    );
  element.innerHTML = result;
}

export async function appendBody(filePath: string): Promise<void> {
  const result = await (await fetch(filePath)).text();
  const fragment = document.createElement("div");
  fragment.innerHTML = result;
  document.body.append(fragment);
}
