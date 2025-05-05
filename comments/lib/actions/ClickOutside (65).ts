import { Action } from 'svelte/action';

// * 65.0 Здесь мы учимся создавать кастомную функцию. В ряде мест нам нехватает функционала, чтобы можно было скрыть что-то, кликнув за пределы этого блока, например, как с SlidePanel или когда у нас есть открытое контекстное меню по клику на кнопку "три точки" в списке инвойсов или клиентов и т.д. Для всех таких моментов можно будет использовать этот функционал, что увеличит удобство пользования интерфейсом.
// 65.1 Обратим внимание, что в слушатель события мы добавим также третий параметр true, который переключает всплытие событий от элемента наружу к родительским и до <html>, на погружение, т.е. действие наоборот к дочерним внутрь.
// 65.2 Мы также будем возвращать метод "destroy", который будет удалять наш слушатель после того, как задача выполнена.
// 65.3 Начнём описывать функцию "handleClick". Мы добавим проверку, что если "node" (элемент на странице), который мы передали в функцию не является тем, который мы передали, а значит пользователь кликнул снаружи элемента, то запустится "runFunction".
// 65.4 Чтобы убрать некоторые ошибки TS расставим типы: clickOutside у нас типа "Action", который является дженериком (функция в TS, в которую если передать тип данных "number", то и вернётся тип данных "number", а если передать в эту же функцию "string", то и вернётся "string").
// Go to [src\routes\(dashboard)\clients\ClientRow.svelte]
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
