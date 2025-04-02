<script lang="ts">
  // Мы можем не только указывать тип данных, но и определённые строчки, которые дозволено сюда заносить значением.
  export let label: 'draft' | 'sent' | 'current' | 'late' | 'paid' | 'archive' = 'draft';
  export let className = '';
</script>

<!-- Improving Tag comp. with ability to add a className from outside. -->
<div
  class={`text-md w-20 rounded-full border-1 text-center font-bold capitalize ${className}`}
  class:inverted={label === 'draft'}
  class:success={label === 'sent' || label === 'current'}
  class:alert={label === 'late'}
  class:archive={label === 'paid' || label === 'archive'}
>
  {label}
</div>

<style lang="postcss">
  .inverted {
    @apply border-pastelPurple;
    @apply text-pastelPurple;
  }
  .success {
    @apply border-robinEggBlue;
    @apply bg-robinEggBlue;
    @apply text-blueGem;
  }
  .alert {
    @apply border-scarlet;
    @apply bg-scarlet;
    @apply text-goldenFizz;
  }
  .archive {
    @apply border-pastelPurple;
    @apply bg-pastelPurple;
    @apply text-white;
  }
</style>
