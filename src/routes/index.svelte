<script lang="ts">
	import type { IStory } from '$lib/models';
	import { browser } from '$app/env';

	export let stories: IStory[];
	let show_hidden = false;
	let hide = [];

	// TODO: deal with localStorage limit
	browser && localStorage.getItem('hide') && (hide = JSON.parse(localStorage.getItem('hide')!));
	let loaded = true; // TODO: use to get rid of flickering

	function toggle_id(id: number) {
		if (hide.includes(id)) {
			hide = hide.filter((i) => i !== id);
		} else {
			hide.push(id);
		}
		hide = hide;
		localStorage.setItem('hide', JSON.stringify(hide));
	}
	function get_origin(url: string) {
		return new URL(url).origin;
	}
</script>

<button
	on:click={() => {
		show_hidden = !show_hidden;
	}}
>
	toggle hidden
</button>

{#each stories as story, i}
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
	</div>
{/each}
