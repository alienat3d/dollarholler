<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  export let label: string;
  export let onClick: () => void;
  export let style:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'textOnly'
    | 'textOnlyDestructive' = 'primary';
  export let isAnimated = true;
  export let iconLeft: (new (...args: any[]) => SvelteComponent) | null = null;
  export let iconRight: (new (...args: any[]) => SvelteComponent) | null = null;
</script>

<button
  on:click|preventDefault={() => onClick()}
  class="button"
  class:primary={style === 'primary'}
  class:secondary={style === 'secondary'}
  class:destructive={style === 'destructive'}
  class:outline={style === 'outline'}
  class:textOnly={style === 'textOnly'}
  class:textOnlyDestructive={style === 'textOnlyDestructive'}
  class:isAnimated
>
  <!-- 36.6 Последнее, что мы починим в этом уроке — избавимся от предупреждения в консоли "<Trash> was created with unknown prop 'class'". Для этого просто обернём их в div и дадим ему утилитарные классы этих стилей. -->
  {#if iconLeft}
    <div class="mr-2">
      <svelte:component this={iconLeft} />
    </div>
  {/if}
  {label}
  {#if iconRight}
    <div class="ml-2">
      <svelte:component this={iconRight} />
    </div>
  {/if}
</button>

<style lang="postcss">
  .isAnimated {
    @apply translate-y-0 shadow-colored transition-all hover:-translate-y-2 hover:shadow-coloredHover;
  }

  .primary {
    @apply bg-lavenderIndigo text-white;
  }

  .secondary {
    @apply bg-gallery text-daisyBush;
  }

  .destructive {
    @apply bg-scarlet text-goldenFizz;
  }

  .textOnly {
    @apply bg-transparent px-0 text-lavenderIndigo no-underline hover:underline;
  }

  .textOnlyDestructive {
    @apply bg-transparent px-0 text-scarlet underline hover:no-underline;
  }

  .outline {
    @apply border-daisyBush text-daisyBush hover:bg-daisyBush hover:text-white;
  }
</style>
