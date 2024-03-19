export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
export async function controlValidation(
  validationCallback: () => Promise<number>,
  finalizationCallback: () => any,
  refreshTime: number = 2000,
  timeout: number = null,
) {
  let actualProgress = 0;
  let elapsedTime = 0;
  while (
    actualProgress !== 100 ||
    (timeout && actualProgress !== 100 ? elapsedTime < timeout : false)
  ) {
    actualProgress = await validationCallback();
    await delay(refreshTime);
    elapsedTime += refreshTime;
    console.log(actualProgress);
  }
  finalizationCallback();
}
