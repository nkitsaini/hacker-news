export interface IStory {
	type: "story";
	by: string;
	descendants: number;
	id: number;
	kids: number[];
	score: number;
	time: number;
	title: string;
	url: string | undefined
}