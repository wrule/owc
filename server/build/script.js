
function target() {
  let result = 0;
  for (let i = 0; i < 1e8; ++i) result = Math.floor(Math.random() * 1e8);
  return result;
}

let max = -Infinity;
let iterations = 0;
const interval = 10;
while (true) {
  if (iterations % interval === 0)
    self.postMessage({ type: 'iterations', data: interval });
  const num = target();
  if (num > max) {
    max = num;
    self.postMessage({ type: 'best', data: { value: max, params: { time: Date.now() } } });
  }
  iterations++;
}
