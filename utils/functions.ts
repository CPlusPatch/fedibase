/**
 * Joins two sets of classNames with a space
 * @param classes Classes to join
 * @returns Joined classes
 */
export function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

/**
 * Strips Unicode control characters from strings and normalizes newlines
 * @param text Text to strip
 * @returns Stripped text
 */
export function stripNonPrintableAndNormalize(text: string) {
	if (!text) return "";
	// strip control chars
	text = text.replace(/\p{C}/gu, "");

	// other common tasks are to normalize newlines and other whitespace

	// normalize newline
	text = text.replace(/\n\r/g, "\n");
	text = text.replace(/\p{Zl}/gu, "\n");
	text = text.replace(/\p{Zp}/gu, "\n");

	// normalize space
	text = text.replace(/\p{Zs}/gu, " ");

	return text;
}

/**
 * Turns a string of HTML into a JSX element with emojis parsed as img tags
 * @param string String of HTML to render
 * @param emojis List of emojis in the text
 * @returns JSX element of rendered HTML with the emoji
 */
export function withEmojis(string: string, emojis: Entity.Emoji[]) {
	string = stripNonPrintableAndNormalize(string);
	emojis.forEach(emoji => {
		const re = new RegExp(`:${emoji.shortcode}:`, "g");
		string = string.replaceAll(
			re,
			`<img src="${emoji.url}" loading="lazy" alt="Emoji (${emoji.shortcode})" style="height: 1em; display: inline; vertical-align: middle;" />`
		);
	});

	return string;
}

/**
 * Turns a string of HTML into a JSX element with emojis parsed as img tags
 * @param string String of HTML to render
 * @param emojis List of emojis in the text
 * @returns JSX element of rendered HTML with the emoji
 */
export function withEmojiReactions(
	string: string,
	emojis: Entity.Status["emoji_reactions"]
) {
	string = stripNonPrintableAndNormalize(string);
	emojis.forEach(emoji => {
		// img has .25em bottom margin to line up right
		string = string.replaceAll(
			`:${emoji.name.split("@")[0]}:`,
			`<img src="${(emoji as any).url}" loading="lazy" alt="Emoji (${
				emoji.name
			})" style="height: 1em; display: inline; margin-bottom: 0.25em"/>`
		);
	});

	return string;
}

/**
 * Human readable elapsed or remaining time (example: 3 minutes ago)
 * @param  {Date|Number|String} date A Date object, timestamp or string parsable with Date.parse()
 * @param  {Date|Number|String} [nowDate] A Date object, timestamp or string parsable with Date.parse()
 * @param  {Intl.RelativeTimeFormat} [trf] A Intl formater
 * @return {string} Human readable elapsed or remaining time
 * @author github.com/victornpb
 * @see https://stackoverflow.com/a/67338038/938822
 */
export function fromNow(
	date: any,
	rft = new Intl.RelativeTimeFormat(undefined, {
		numeric: "auto",
		style: "short",
	})
) {
	const SECOND = 1000;
	const MINUTE = 60 * SECOND;
	const HOUR = 60 * MINUTE;
	const DAY = 24 * HOUR;
	const WEEK = 7 * DAY;
	const MONTH = 30 * DAY;
	const YEAR = 365 * DAY;
	const intervals = [
		{ ge: YEAR, divisor: YEAR, unit: "year" },
		{ ge: MONTH, divisor: MONTH, unit: "month" },
		{ ge: WEEK, divisor: WEEK, unit: "week" },
		{ ge: DAY, divisor: DAY, unit: "day" },
		{ ge: HOUR, divisor: HOUR, unit: "hour" },
		{ ge: MINUTE, divisor: MINUTE, unit: "minute" },
		{ ge: 30 * SECOND, divisor: SECOND, unit: "seconds" },
		{ ge: 0, divisor: 1, text: "just now" },
	];
	const nowDate = Date.now();
	const now = new Date(nowDate).getTime();
	const diff =
		now - (typeof date === "object" ? date : new Date(date)).getTime();
	const diffAbs = Math.abs(diff);
	for (const interval of intervals) {
		if (diffAbs >= interval.ge) {
			const x = Math.round(Math.abs(diff) / interval.divisor);
			const isFuture = diff < 0;
			return interval.unit
				? rft.format(isFuture ? x : -x, interval.unit as any)
				: interval.text;
		}
	}
}

export function findMentions(status: Entity.Status, excludeId: string | null) {
	return [
		...new Map(
			status.mentions
				.concat([status.account])
				.filter(m => m.id !== excludeId)
				.map(v => [v.id, v])
		).values(),
	].map(m => "@" + m.acct);
}
