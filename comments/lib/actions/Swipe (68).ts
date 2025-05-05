import { Action } from 'svelte/action';
import { spring } from 'svelte/motion';

interface SwipeProps {
  triggerReset?: boolean;
}
// 68.1.0 Создадим параметр для экшена "swipe" и создадим также переменную "triggerReset" и здесь. И добавим этот параметр в interface, т.о. TS будет знать какой именно параметр ожидать.
// 68.6 Ещё хорошо бы определить "swipe" как CustomAction. Для этого
export const swipe: Action<HTMLElement, SwipeProps> = (node, params) => {
  const elementWidth = node.clientWidth;
  let x: number;
  let startingX: number;
  let triggerReset = params?.triggerReset || false;

  const coordinates = spring({ x: 0, y: 0 }, { stiffness: 0.2, damping: 0.4 });

  coordinates.subscribe(($coords) => (node.style.transform = `translate3d(${$coords.x}px, 0, 0)`));

  // 68.2 В этой функции мы будем обнулять позиционирование инвойс-элемента (т.о. возвращая его на прежнее место). Ну, а "triggerReset" у нас вернётся в положение false.
  // Go to [src\routes\(dashboard)\invoices\InvoiceRow.svelte]
  const resetCard = () => {
    coordinates.update(() => {
      return { x: 0, y: 0 };
    });

    triggerReset = false;
  };

  // 68.4.0 Всё бы хорошо, но срабатывает это пока лишь 1 раз, а на второй раз ничего не происходит. Причина в том, что triggerReset в [src\routes\(dashboard)\invoices\InvoiceRow.svelte] выходит из синхронизацией со здешним. Чтобы это исправить создадим ещё одну функцию "outOfView", которая будет запускать создание события всякий раз, когда элемент инвойса уехал за экран. Для этого мы применим на "node" метод "dispatchEvent". ↓
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

  // 68.4.1 И мы будем вызывать "outOfView" каждый раз, когда пользователь свайпает влево.
  // Go to [src\routes\(dashboard)\invoices\InvoiceRow.svelte]
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

  // 68.1.1 Далее мы перейдём вниз функции "swipe", где используем метод "update", который срабатывает всякий раз, когда элемент, на котором висит функция изменяется. Он принимает параметры, которым дадим тип "SwipeProps". А внутри опишем, что когда параметр triggerReset в положении true, то запустим функцию "resetCard", которую тут же и опишем. ↑
  return {
    update(newParams: SwipeProps) {
      if (newParams.triggerReset) resetCard();
    },
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
    }
  };
};
