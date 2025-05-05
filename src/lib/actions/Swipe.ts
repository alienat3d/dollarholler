import { Action } from 'svelte/action';
import { spring } from 'svelte/motion';

interface SwipeProps {
  triggerReset?: boolean;
}

export const swipe: Action<HTMLElement, SwipeProps> = (node, params) => {
  const elementWidth = node.clientWidth;
  let x: number;
  let startingX: number;
  let triggerReset = params?.triggerReset || false;

  const coordinates = spring({ x: 0, y: 0 }, { stiffness: 0.2, damping: 0.4 });

  coordinates.subscribe(($coords) => (node.style.transform = `translate3d(${$coords.x}px, 0, 0)`));

  const resetCard = () => {
    coordinates.update(() => {
      return { x: 0, y: 0 };
    });

    triggerReset = false;
  };

  const outOfView = () => node.dispatchEvent(new CustomEvent('outOfView'));

  const handleMouseDown = (event: MouseEvent) => {
    x = event.clientX;
    startingX = event.clientX;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const dx = event.clientX - x;

    x = event.clientX;

    coordinates.update(($coords) => {
      return {
        x: $coords.x + dx,
        y: 0
      };
    });
  };

  const updateCoordinates = (x) => {
    coordinates.update(() => {
      return { x, y: 0 };
    });
  };

  const moveCardOver = (endingX: number) => {
    const leftSnapX = elementWidth * -0.96;
    const rightSnapX = 0;
    const movement = startingX - endingX;

    // swiped left
    if (movement > 20) {
      x = leftSnapX;
      outOfView();
    } // swiped right
    else {
      x = rightSnapX;
    }

    updateCoordinates(x);
  };

  const handleMouseUp = (event: MouseEvent) => {
    const endingX = event.clientX;
    moveCardOver(endingX);

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  node.addEventListener('mousedown', handleMouseDown);

  return {
    update(newParams: SwipeProps) {
      if (newParams.triggerReset) resetCard();
    },
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
    }
  };
};
