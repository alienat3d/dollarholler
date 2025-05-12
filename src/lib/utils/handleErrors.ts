import { snackbar } from '$lib/stores/SnackbarStore';

// 84.3.1 Скопируем сюда этот код из [src\lib\stores\ClientStore.ts] и обернём его в функцию, которая пример аргументов ошибку типа Error. Этот тип Error мы также добавим в [src\global.d.ts]
// Go to [src\lib\stores\InvoiceStore.ts]
export const displayErrorMessage = (error: Error) => {
  console.error(error);
  snackbar.send({
    message: error.message,
    type: 'error'
  });
  return;
};
