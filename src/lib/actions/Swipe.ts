import { spring } from 'svelte/motion';

interface SwipeProps {}

export const swipe = (node: HTMLElement, params: SwipeProps) => {
  const elementWidth = node.clientWidth;
  let x: number;
  let startingX: number;
  let endingX: number;

  const coordinates = spring({ x: 0, y: 0 }, { stiffness: 0.2, damping: 0.4 });

  coordinates.subscribe(($coords) => {
    node.style.transform = `translate3d(${$coords.x}px, 0, 0)`;
  });

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

  const updateCoordinates = (x: number) => {
    coordinates.update(() => {
      return {
        x,
        y: 0
      };
    });
  };

  const moveCardOver = (endingX: number) => {
    const leftSnapX = elementWidth * -0.95;
    const rightSnapX = 0;
    const movement = startingX - endingX;

    if (movement > 20) {
      x = leftSnapX;
      updateCoordinates(x);
    }
    if (movement < -20) {
      x = rightSnapX;
      updateCoordinates(x);
    }

    coordinates.update(() => {
      return {
        x,
        y: 0
      };
    });
  };

  const handleMouseUp = (event: MouseEvent) => {
    endingX = event.clientX;
    moveCardOver(endingX);

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  node.addEventListener('mousedown', handleMouseDown);
  return {
    // update() {},
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
    }
  };
};
