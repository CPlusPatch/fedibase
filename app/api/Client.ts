import generator from "megalodon";

export enum ApiType {
	Mastodon,
	Pleroma,
}

interface HomeTimelineOptions {
	local?: boolean | undefined;
	limit?: number | undefined;
	max_id?: string | undefined;
	since_id?: string | undefined;
	min_id?: string | undefined;
}

export default class Client {
	instanceUrl: URL;
	accessToken: string;
	apiType: ApiType;

	constructor(instanceUrl: URL, accessToken: string, apiType: ApiType) {
		this.instanceUrl = instanceUrl;
		this.accessToken = accessToken;
		this.apiType = apiType;
	}

	_objectToStrings(input: { [key: string]: any }): { [key: string]: string } {
		const output: { [key: string]: string } = {};
		for (const key in input) {
			output[key] = String(input[key]);
		}
		return output;
	}

	async getHomeTimeline(options?: HomeTimelineOptions) {
		const result = await fetch(
			`https://${this.instanceUrl.host}/api/v1/timelines/home` +
				new URLSearchParams(this._objectToStrings(options ?? {})),
			{
				method: "GET",
				headers: {
					authorization: `Bearer ${this.accessToken}`,
				},
			}
		);

		return (await result.json()) as Entity.Status[];
	}
}
