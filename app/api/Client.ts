import generator from "megalodon";

/**
 * An enum representing the different types of supported APIs.
 */
export enum ApiType {
	Mastodon,
	Pleroma,
}

/**
 * An object representing the optional parameters for getting the home timeline.
 */
interface HomeTimelineOptions {
	/** Whether to only show toots from the current instance. */
	local?: boolean;
	/** The maximum number of toots to retrieve. */
	limit?: number;
	/** The maximum ID of the toot to retrieve. */
	max_id?: string;
	/** The minimum ID of the toot to retrieve. */
	since_id?: string;
	/** The ID of the newest toot to exclude from the results. */
	min_id?: string;
}

/**
 * A client for interacting with a Mastodon or Pleroma instance.
 */
export default class Client {
	/**
	 * The base URL of the Mastodon or Pleroma instance.
	 */
	instanceUrl: URL;

	/**
	 * The access token used to authenticate requests to the API.
	 */
	accessToken: string;

	/**
	 * The type of API used by the instance.
	 */
	apiType: ApiType;

	/**
	 * Creates a new Mastodon or Pleroma API client.
	 * @param instanceUrl The base URL of the Mastodon or Pleroma instance.
	 * @param accessToken The access token used to authenticate requests to the API.
	 * @param apiType The type of API used by the instance.
	 */
	constructor(instanceUrl: URL, accessToken: string, apiType: ApiType) {
		this.instanceUrl = instanceUrl;
		this.accessToken = accessToken;
		this.apiType = apiType;
	}

	/**
	 * Converts an object's values to strings.
	 * @param input The object to convert.
	 * @returns An object with the same keys as `input`, but with string values.
	 */
	_objectToStrings(input: { [key: string]: any }): { [key: string]: string } {
		const output: { [key: string]: string } = {};
		for (const key in input) {
			output[key] = String(input[key]);
		}
		return output;
	}

	/**
	 * Retrieves the home timeline for the authenticated user.
	 * @param options Optional parameters for the timeline request.
	 * @returns A Promise that resolves to an array of `Entity.Status` objects representing the toots in the home timeline.
	 */
	async getHomeTimeline(
		options?: HomeTimelineOptions
	): Promise<Entity.Status[]> {
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
