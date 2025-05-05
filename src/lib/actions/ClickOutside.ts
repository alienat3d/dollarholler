import { Action } from 'svelte/action';

type ClickOutsideCallback = () => void;

export const clickOutside: Action<HTMLDivElement, ClickOutsideCallback> = (node, runFunction) => {
  const handleClick = (event: MouseEvent) => {
    if (!node.contains(event.target as HTMLElement)) {
      if (runFunction) runFunction();
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  };
};
