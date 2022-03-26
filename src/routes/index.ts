import type { IStory } from "$lib/models";
import type { RequestHandler } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit/types/internal";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";
export async function get(event: RequestEvent): Promise<ReturnType<RequestHandler>> {

	const r = await fetch(BASE_URL + "/topstories.json");
	let story_ids: number[] = await r.json();
	function fetch_story(id: number): Promise<IStory> {
		return fetch(BASE_URL + "/item/" + id + ".json")
			.then(r => r.json());
	}
	let stories = await Promise.all(story_ids.slice(0, 30).map(fetch_story))
	return {
		// @ts-ignore TODO: why is it giving lint error?
		body: {
			stories
		}
	}

}
/*
{
  "by" : "dhouston",
  "descendants" : 71,
  "id" : 8863,
  "kids" : [ 8952, 9224, 8917, 8884, 8887, 8943, 8869, 8958, 9005, 9671, 8940, 9067, 8908, 9055, 8865, 8881, 8872, 8873, 8955, 10403, 8903, 8928, 9125, 8998, 8901, 8902, 8907, 8894, 8878, 8870, 8980, 8934, 8876 ],
  "score" : 111,
  "time" : 1175714200,
  "title" : "My YC app: Dropbox - Throw away your USB drive",
  "type" : "story",
  "url" : "http://www.getdropbox.com/u/2/screencast.html"
}
*/