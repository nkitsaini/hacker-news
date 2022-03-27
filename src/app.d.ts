/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	interface Platform {
		env: {
			HN_KV: KVNamespace
		}
	}
	// interface Session {}
	// interface Stuff {}
}
