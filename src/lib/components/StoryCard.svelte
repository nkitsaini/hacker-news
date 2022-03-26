<!-- <script lang="ts">
	import type { IStory } from "$lib/models";
	import { createEventDispatcher } from "svelte";
	export let story: IStory;
	let dispatcher = createEventDispatcher<{toggle: }>();
</script>

	<div class:hidden={!show_hidden && hide.includes(story.id)}>
		<div class="border border-blue-200">
			<a href="https://news.ycombinator.com/item?id={story.id}">
				<span class="">{i + 1}. {story.title}</span>
			</a>
			|
			{#if story.url}
				<a href={story.url}>
					<span> Blog ({get_origin(story.url)})</span>
				</a>
			{/if}
			<br />
		</div>
		<button class="border-red-100 border" on:click={() => toggle_id(story.id)}>
			{hide.includes(story.id) ? 'show' : 'hide'}
		</button>
	</div> -->