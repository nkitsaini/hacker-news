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
		board && console.log(story_divs[visible_ids[current_focus]]?.children);
		board && story_divs[visible_ids[current_focus]]?.children[0].children[0].focus();
		// if (current_focus == 0) {
		// 	board?.scroll({ top: 0 });
		// 	browser && window.scroll({ top: 0 });
		// }
	}
	// $: (board && (board.children[current_focus] as HTMLDivElement)).focus();
	// onMount(() => {
	// 	(board.children[current_focus] as HTMLDivElement).focus();
	// });
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="flex flex-col h-full">
	<nav class=" flex-grow-0">
		<button
			on:click={() => {
				show_hidden = !show_hidden;
			}}
		>
			toggle hidden
		</button>
		{stories.length - visible_ids.length} hidden Showing hidden:{show_hidden}
		<br />
		{current_focus}
	</nav>

	<div bind:this={board} class="pt-[20px] flex-grow overflow-scroll border border-green-400">
		{#each stories as story, i}
			<div
				class:hidden={!show_hidden && hide.includes(story.id)}
				class="focus:bg-blue-100 focus-within:bg-yellow-100"
				bind:this={story_divs[story.id]}
				on:keydown={(event) => {
					event.key == 'h' && toggle_id(story.id);
				}}
			>
				<div class="border border-blue-200 focus:border-red-200">
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
	</div>
</div>

<style>
</style>
