<!-- ? Шаблон для динамически генерируемых страниц индивидуального инвойса -->
<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { convertDate } from '$lib/utils/dateHelpers';
  import LineItemRows from '../LineItemRows.svelte';

  // * 41.0 Пришло время сделать страницу динамической. Данные для инвойса уже проходят на сквозь через проп "data", который мы добавим. "data" это объект в котором другой объект "invoice" с типом Invoice.
  export let data: { invoice: Invoice };
  console.log(data);

  const printInvoice = () => {
    console.log('print invoice');
  };

  const copyLink = () => {
    console.log('copy link');
  };

  const sendInvoice = () => {
    console.log('send invoice');
  };

  const payInvoice = () => {
    console.log('pay invoice');
  };
</script>

<div class="fixed z-0 mb-16 flex w-full max-w-screen-lg justify-between">
  <h1 class="text-3xl font-bold text-daisyBush">Invoice</h1>
  <div class="flex items-center gap-4">
    <Button
      height="short"
      label="Print"
      style="outline"
      isAnimated={false}
      onClick={printInvoice}
    />
    <Button height="short" label="Copy Link" onClick={copyLink} />
    <Button height="short" label="Send" onClick={sendInvoice} />
    <Button height="short" label="Pay Invoice" onClick={payInvoice} />
  </div>
</div>

<div
  class="relative top-32 z-10 grid grid-cols-6 gap-x-5 gap-y-8 bg-white py-16 px-32 shadow-slidePanel"
>
  <div class="col-span-3">
    <img
      src="/images/logo.png"
      srcset="/images/logo@2x.png 2x, /images/logo.png 1x"
      alt="Compressed.fm Logo"
    />
  </div>

  <!-- 41.1 Это мы пока не трогаем, т.к. это должно заполняться из настроек, т.к. это наша информация. -->
  <div class="col-span-2 col-start-5 pt-4">
    <div class="label">From</div>
    <p>
      Al Zaplin<br />
      123 Main Street<br />
      Pigeon Forge, TN 54321
    </p>
  </div>

  <!-- 41.2 Начинаем заполнять динамические данные, точнее их пути, где они расположены. -->
  <div class="col-span-3">
    <div class="label">Bill To:</div>
    <p>
      <strong>{data.invoice.client.name}</strong><br />
      {data.invoice.client.email}<br />
      {data.invoice.client.street}<br />
      {data.invoice.client.city}, {data.invoice.client.state}
      {data.invoice.client.zip}
    </p>
  </div>

  <div class="col-span-2 col-start-5">
    <div class="label">Invoice ID</div>
    <p>{data.invoice.invoiceNumber}</p>
  </div>

  <div class="col-span-3">
    <div class="label">Due Date</div>
    <p>{convertDate(data.invoice.dueDate)}</p>
  </div>

  <div class="col-span-2 col-start-5">
    <div class="label">Issue Date</div>
    <p>{convertDate(data.invoice.issueDate)}</p>
  </div>

  <div class="col-span-6">
    <div class="label">Subject</div>
    <p>{data.invoice.subject}</p>
  </div>

  <!-- 41.3.0 Там где у нас перечень инвойсов подставляем наш комп. с инвойсами и вставляем в него сами инвойсы. Но пока, как и в обычной форме создания\редактирования инвойсов, мы можем редактировать и здесь содержимое, а нам нужно сделать его на этой странице только доступным для просмотра. Для этого добавим дополнительный проп isEditable в положение false. -->
  <!-- Go to [src\routes\(dashboard)\invoices\LineItemRows.svelte] -->
  <!-- 41.6 Ещё можно заметить, что в индивидуальный отчётах дисконт не работает как должен, чтобы его починить мы добавим сюда discount, но в значении также добавим "?", т.к. не в каждом инвойсе он может быть, а если его нет, то он должен быть нулём. -->
  <!-- Go to [src\routes\(dashboard)\invoices\LineItemRows.svelte] -->
  <div class="col-span-6">
    <LineItemRows
      lineItems={data.invoice.lineItems}
      isEditable={false}
      discount={data?.invoice?.discount || 0}
    />
  </div>

  {#if data.invoice.notes}
    <div class="col-span-6">
      <div class="label">Notes</div>
      <p>{data.invoice.notes}</p>
    </div>
  {/if}

  {#if data.invoice.terms}
    <div class="col-span-6">
      <div class="label">Terms and Conditions</div>
      <p>{data.invoice.terms}</p>
    </div>
  {/if}
</div>

<style lang="postcss">
  .label {
    @apply font-black text-monsoon;
  }
</style>
