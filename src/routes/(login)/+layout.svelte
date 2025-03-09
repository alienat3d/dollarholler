<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-blue-500 p-4">{@render children()}</div>

<!-- ? Также можно указать любому файлу +page брать шаблон из корневого файла "+layout", если записать его "+page@.svelte". -->
<!-- ? Ещё можно сообщить любому +layout файлу брать стили из другого шаблона, назвав его так: "+layout@названиепапки.svelte" -->
