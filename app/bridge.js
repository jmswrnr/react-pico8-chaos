
export const CartBridge = () => {
  const addEventListener = (parent) => (type, listener) => console.log({parent,type,listener});
  const loadOffscreenCart = (canvas) => {
    console.log = () => {};
    canvas.addEventListener = addEventListener('canvas');
    globalThis.window = {
      addEventListener: addEventListener('window'),
      location: {
        pathname: {
          indexOf: () => -1
        }
      }
    };
    globalThis.Module = {
      canvas,
    };
    globalThis.document = {
      addEventListener: addEventListener('document'),
      getElementById: () => undefined
    };

    runCartScript.apply(globalThis, [globalThis.Module]);
  };
  self.onmessage = function (event) {
    if (event.data.cmd === "init") {
      loadOffscreenCart(event.data.canvas);
    }
  };
};