<script lang="ts">
	export let errors: string[] | undefined;
</script>

{#if errors && errors.length}
	<div class="text-sm text-destructive" aria-live="assertive">
		{#each errors as err}
			<p>{err}</p>
		{/each}
	</div>
{/if}
