// @ts-nocheck


/*
This File is Deployed a cloudflare worker at https://dash.cloudflare.com/2bbd106129aa68db551e5a9c61bff413/workers/services/view/hacker-news-collector/production/
puts the top stories list into hacker-news KV
*/
addEventListener("fetch", event => {
	event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
	let top_stories = JSON.stringify(await get_top_stories())
	await HN_KV.put("topstories", top_stories)
  
	return new Response(top_stories)
  }
  
  const BASE_URL="https://hacker-news.firebaseio.com/v0"
  
  async function get_top_stories() {
	const r = await fetch(BASE_URL + "/topstories.json");
	  let story_ids = await r.json();
	  function fetch_story(id) {
		  return fetch(BASE_URL + "/item/" + id + ".json")
			  .then(r => r.json());
	  }
	  let stories = await Promise.all(story_ids.slice(0, 30).map(fetch_story))
	  return stories
  }
  
  async function handleScheduled(event) {
	await HN_KV.put("topstories", JSON.stringify(await get_top_stories()))
  }
  addEventListener('scheduled', event => {
	event.waitUntil(handleScheduled(event));
  });
  