<script lang="ts">
	import type { IStory } from '$lib/models';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';

	export let stories: IStory[];
	let show_hidden = false;
	let hide = [];
	// TODO: deal with localStorage limit
	browser && localStorage.getItem('hide') && (hide = JSON.parse(localStorage.getItem('hide')!));
	let loaded = true; // TODO: use to get rid of flickering
	$: visible_ids = stories.map((s) => s.id).filter((id) => !hide.includes(id) || show_hidden);

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
	let current_focus = 0;
	let story_divs: { [key: number]: HTMLDivElement } = {};
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 't') {
			show_hidden = !show_hidden;
		} else if (event.key === 'j' && current_focus != visible_ids.length - 1) {
			current_focus += 1;
		} else if (event.key === 'k' && current_focus != 0) {
			current_focus -= 1;
		}
		// fix overflow
		current_focus >= visible_ids.length && (current_focus = visible_ids.length - 1);
		current_focus < 0 && (current_focus = 0);
	}
	let board: HTMLDivElement;
	$: {
		board && story_divs[visible_ids[current_focus]]?.focus();
	}
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="flex flex-col h-full">
	<nav class=" flex-grow-0">
		<!-- <button
			on:click={() => {
				show_hidden = !show_hidden;
			}}
		>
			toggle hidden
		</button> -->
		<label
			>Show Hidden:
			<input type="checkbox" bind:checked={show_hidden} />
		</label>
		|
		{stories.length - visible_ids.length} hidden | Focus: {current_focus}
	</nav>

	<div bind:this={board} class=" flex-grow overflow-y-scroll border border-green-400">
		{#each stories as story, i}
			<div
				class:hidden={!show_hidden && hide.includes(story.id)}
				class="focus:bg-blue-100 focus-within:bg-yellow-100  text-slate-600"
				bind:this={story_divs[story.id]}
				tabindex="0"
				on:keydown={(event) => {
					event.key == 's' && toggle_id(story.id);
					event.key == 'Enter' &&
						(window.location.href = `https://news.ycombinator.com/item?id=${story.id}`);
					event.key == 'b' && story.url && (window.location.href = story.url);
				}}
			>
				<div>
					<a href="https://news.ycombinator.com/item?id={story.id}">
						<span class=" text-slate-800"> {i + 1}. {story.title}</span>
					</a>
					{#if story.url}
						<a href={story.url}>
							<span> ({get_origin(story.url)})</span>
						</a>
					{/if}
					<br />
				</div>
				<button class="" on:click={() => toggle_id(story.id)}>
					{hide.includes(story.id) ? 'show' : 'hide'}
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
</style>
