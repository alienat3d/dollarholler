import type { Action } from 'svelte/action';
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

  const isMobileBreakpoint = () => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');

    if (mediaQuery.matches) return true;
  };

  // 70.0.1 А также она должна вызваться как только этот код считается ↓
  // 70.1 Теперь мы добавим к событиям мышки также тач-события. ↓
  const setupEventListeners = () => {
    if (isMobileBreakpoint()) {
      node.addEventListener('mousedown', handleMouseDown);
      node.addEventListener('touchstart', handleTouchStart);
    } else {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('touchstart', handleTouchStart);
    }

    elementWidth = node.clientWidth;
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

  // 70.2 Здесь функция для начала движения на тачскрине будет похожа на предыдущую "handleMouseDown", за искл., что после "event" добавляется "touches[0]", ну и события будут "touchmove" & "touchend".
  const handleTouchStart = (event: TouchEvent) => {
    x = event.touches[0].clientX;
    startingX = event.touches[0].clientX;

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  // 70.3 Также и "handleTouchMove" будет очень похожа на "handleMouseMove" за некоторыми корректировками.
  const handleMouseMove = (event: MouseEvent) => {
    const dx = event.clientX - x;

    x = event.clientX;

    updateCoordinates(dx);
  };

  const handleTouchMove = (event: TouchEvent) => {
    const dx = event.touches[0].clientX - x;

    x = event.touches[0].clientX;

    updateCoordinates(dx);
  };

  // 70.4 Сделаем и тут небольшой рефакторинг: переименуем в "setXCoordinates", потому, как это название более соответствует тому, что делает эта функция, а затем создадим ещё одну функцию "updateCoordinates" и перенесём туда код из "handleTouchMove", т.к. нам нужно будет его переиспользовать снова.
  const updateCoordinates = (dx: number) => {
    coordinates.update(($coords) => {
      return {
        x: $coords.x + dx,
        y: 0
      };
    });
  };

  const setXCoordinates = (x: number) => {
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

    setXCoordinates(x);
  };

  const handleMouseUp = (event: MouseEvent) => {
    const endingX = event.clientX;
    moveCardOver(endingX);

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // 70.5 Осталось создать "handleTouchEnd", которая также будет похожа на "handleMouseUp". Однако вместо "touches[0]" как в предыдущем примере мы используем "changedTouches[0]", которая хранит разницу изменения позиции с начальной до конечной. ↓
  const handleTouchEnd = (event: TouchEvent) => {
    const endingX = event.changedTouches[0].clientX;
    moveCardOver(endingX);

    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  // 70.0.3 И теперь можно избавиться от этого условия, т.к. оно уже включено в функцию "setupEventListeners". ↑
  // if (isMobileBreakpoint()) node.addEventListener('mousedown', handleMouseDown);

  // * 70.0.0 В этом уроке мы переведём этот экшен (точнее его слушатели событий) с событий мышки на события тапа (прикосновения пальца к экрану). Но прежде займёмся небольшим рефакторингом и вынесем логику из этого слушателя в отдельную функцию "setupEventListeners", которую создадим выше. ↑
  window.addEventListener('resize', setupEventListeners);

  // 70.0.2
  setupEventListeners();

  // 70.6 Также нужно удалять слушатель для "touchstart" по окончанию события, чтобы они не множились.
  return {
    update(newParams: SwipeProps) {
      if (newParams.triggerReset) resetCard();
    },
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('touchstart', handleTouchStart);
    }
  };
};
