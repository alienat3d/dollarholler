<script lang="ts">
  import View from '$lib/components/Icon/View.svelte';
  import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
  import Edit from '$lib/components/Icon/Edit.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import Activate from '$lib/components/Icon/Activate.svelte';
  import Archive from '$lib/components/Icon/Archive.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';

  // 50.8 Мы добавим проп client, чтобы принимать данные из хранилища и начнём заполнять ими вёрстку динамически.
  export let client: Client;
  // console.log(client);

  // 50.3.0 После того, как мы заполнили вёрстку, добавим немного логики, также, как и на странице со списком инвойсов у нас тут будет всплывающее меню, которое будет показываться по клику на ThreeDots кнопку.
  let isAdditionalMenuShowing = false;
</script>

<div class="client-table rounded-lg bg-white py-3 shadow-tableRow lg:py-6">
  <div><Tag className="ml-auto" label={client.clientStatus} /></div>
  <div class="truncate whitespace-nowrap text-base font-bold lg:text-xl">{client.name}</div>
  <div class="text-right font-mono text-sm font-bold lg:text-lg">$324.00</div>
  <div class="text-right font-mono text-sm font-bold text-scarlet lg:text-lg">$105.50</div>
  <div class="relative hidden items-center justify-center lg:flex">
    <a class="hover:daisyBush text-pastelPurple transition-colors" href="#"><View /></a>
  </div>
  <!-- 50.3.1 Продолжение этой логики: по клику на кнопку переменная меняет булево значение и показывает или скрывает меню. -->
  <!-- Go to [src\routes\(dashboard)\clients\+page.svelte] -->
  <!-- 50.9 Кнопке "activate" в атрибут "disabled" добавим client.clientStatus === 'active', т.к. нам не нужно, чтобы эта кнопка показывалась в меню, если клиент и так уже активен. То же сделаем и для кнопки "archive". -->
  <!-- 50.10 Далее по клику на кнопку (activate & archive) установим соответствующий статус клиенту. А также будем скрывать это меню после клика. -->
  <div class="relative hidden items-center justify-center lg:flex">
    <button
      class="hover:daisyBush text-pastelPurple transition-colors"
      on:click={() => (isAdditionalMenuShowing = !isAdditionalMenuShowing)}><ThreeDots /></button
    >
    {#if isAdditionalMenuShowing}
      <AdditionalOptions
        options={[
          { label: 'Edit', icon: Edit, onClick: () => console.log('editing'), disabled: false },
          {
            label: 'Activate',
            icon: Activate,
            onClick: () => {
              client.clientStatus = 'active';
              isAdditionalMenuShowing = false;
            },
            disabled: client.clientStatus === 'active'
          },
          {
            label: 'Archive',
            icon: Archive,
            onClick: () => {
              client.clientStatus = 'archive';
              isAdditionalMenuShowing = false;
            },
            disabled: client.clientStatus === 'archive'
          },
          { label: 'Delete', icon: Trash, onClick: () => console.log('deleting'), disabled: false }
        ]}
      />
    {/if}
  </div>
</div>
