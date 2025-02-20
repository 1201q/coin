export const throttle = (time: number = 500) => {
  let timer: NodeJS.Timer | null = null;

  const func = (callback: () => void) => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
      }, time);
      callback();
    }
  };

  return func;
};
