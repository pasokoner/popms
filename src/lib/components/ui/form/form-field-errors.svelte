<script lang="ts">
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils.js";
	import { CircleAlertIcon } from "lucide-svelte";

	type $$Props = FormPrimitive.FieldErrorsProps & {
		errorClasses?: string | undefined | null;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let errorClasses: $$Props["class"] = undefined;
</script>

<FormPrimitive.FieldErrors
	class={cn("flex items-center gap-x-1 text-sm font-medium text-destructive", className)}
	{...$$restProps}
	let:errors
	let:fieldErrorsAttrs
	let:errorAttrs
>
	<slot {errors} {fieldErrorsAttrs} {errorAttrs}>
		{#each errors as error}
			<CircleAlertIcon class="size-4 fill-red-700 text-white" />
			<div {...errorAttrs} class={cn(errorClasses)}>{error}</div>
		{/each}
	</slot>
</FormPrimitive.FieldErrors>
