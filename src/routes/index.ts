import { dev } from "$app/env";
import type { IStory } from "$lib/models";
import type { RequestHandler } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit/types/internal";
import TEST_HN_HOME from '$lib/sample_hn.json';

export async function debug_get(event: RequestEvent): Promise<ReturnType<RequestHandler>> {
	let stories = TEST_HN_HOME;
	return {
		// @ts-ignore
		body: {
			stories
		}
	}
}
export async function prod_get(event: RequestEvent): Promise<ReturnType<RequestHandler>> {
	let stories = JSON.parse(await event.platform.env.HN_KV.get("topstories"));
	return {
		// @ts-ignore TODO: why is it giving lint error?
		body: {
			stories
		}
	}

}

export const get = dev ? debug_get : prod_get;
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