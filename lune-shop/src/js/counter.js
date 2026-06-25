export function setupCounter(element) {
  if (!element) return;

  let counter = 0;

  function setCounter(count) {
    counter = count;
    element.textContent = `Count is ${counter}`;
  }

  element.addEventListener("click", () => {
    setCounter(counter + 1);
  });

  setCounter(0);
}
