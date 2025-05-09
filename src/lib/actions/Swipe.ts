import { Action } from 'svelte/action';
import { spring } from 'svelte/motion';

interface SwipeProps {
  triggerReset?: boolean;
}

export const swipe: Action<HTMLElement, SwipeProps> = (node, params) => {
  let elementWidth = node.clientWidth;
  let x: number;
  let startingX: number;
  let triggerReset = params?.triggerReset || false;

  const coordinates = spring({ x: 0, y: 0 }, { stiffness: 0.2, damping: 0.4 });

  coordinates.subscribe(($coords) => (node.style.transform = `translate3d(${$coords.x}px, 0, 0)`));

  // * 69.0 На самом деле нам нужно подключать функцию свайпа лишь от определённой ширины вьюпорта, т.к. на десктопных экранах пользователи пользуются мышкой соответственно. Для проверки этого мы создадим спец. функцию "isMobileBreakpoint", которая будет проверять вьюпорт пользовательского устройства. Поместим результат выполнения спец. метода браузерного API "matchMedia" в константу "mediaQuery" и в этот метод поместим максимальную ширину вьюпорта, от которого мы хотим сделать, чтобы работал свайп экшен. Затем напишем условие, что если mediaQuery "matches", т.е. true — то и возвращать будем true. ↓
  const isMobileBreakpoint = () => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    if (mediaQuery.matches) return true;
  };

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

  const updateCoordinates = (x: number) => {
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

  // 69.1 А дальше мы можем обернуть наш слушатель в проверку новой функцией проверки вьюпорта.
  if (isMobileBreakpoint()) node.addEventListener('mousedown', handleMouseDown);

  // 69.2 Если же мы хотим, чтобы не только при первом заходе происходила проверка ширины вьюпорта, но и при изменении ширины браузера — нам требуется написать отдельный слушатель для этого.
  // 69.3 Теперь, раз уж мы сделали слушатель события "resize", то можно также починить этот баг, чтобы инвойсы не уезжали дальше поля видимости, если продолжать сужать экран. А сделать это довольно просто, присваивая elementWidth новое значение при ресайзе экрана браузера.
  window.addEventListener('resize', () => {
    isMobileBreakpoint()
      ? node.addEventListener('mousedown', handleMouseDown)
      : node.removeEventListener('mousedown', handleMouseDown);

    elementWidth = node.clientWidth;
  });

  return {
    update(newParams: SwipeProps) {
      if (newParams.triggerReset) resetCard();
    },
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
    }
  };
};
