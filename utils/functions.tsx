import { Entity } from "megalodon";

/* eslint-disable @next/next/no-img-element */
/**
 * Checks if an object is empty (= to {})
 * @param obj The object to check
 * @returns True if the object is {}
 */
export function isEmpty(obj: any): boolean {
	return JSON.stringify(obj) === "{}" || JSON.stringify(obj) === "[]";
}

/**
 * Joins two sets of classNames with a space
 * @param classes Classes to join
 * @returns Joined classes
 */
export function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export function getFromLocalStorage(key: string, defaultValue: string) {
	const item = localStorage.getItem(key);
	return item === null ? defaultValue : item;
}

export function setToLocalStorage(key: string, value: string) {
	localStorage.setItem(key, value);
	return value;
}

/**
 * Turns a string of HTML into a JSX element with emojis parsed as img tags
 * @param string String of HTML to render
 * @param emojis List of emojis in the text
 * @returns JSX element of rendered HTML with the emoji
 */
export function withEmojis(string: string, emojis: Entity.Emoji[]) {
		emojis.forEach((emoji) => {
			// img has .25em bottom margin to line up right
			string = string.replaceAll(
				`:${emoji.shortcode}:`,
				`<img src="${emoji.url}" alt="" style="height: 1em; display: inline; margin-bottom: 0.25em"/>`,
			);
		})

		return <span className="p-0 m-0" dangerouslySetInnerHTML={{ __html: string }}></span>;
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
export function fromNow(date, rft = new Intl.RelativeTimeFormat(undefined, { numeric: "auto", style: "narrow" })) {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;
    const intervals = [
        { ge: YEAR, divisor: YEAR, unit: 'year' },
        { ge: MONTH, divisor: MONTH, unit: 'month' },
        { ge: WEEK, divisor: WEEK, unit: 'week' },
        { ge: DAY, divisor: DAY, unit: 'day' },
        { ge: HOUR, divisor: HOUR, unit: 'hour' },
        { ge: MINUTE, divisor: MINUTE, unit: 'minute' },
        { ge: 30 * SECOND, divisor: SECOND, unit: 'seconds' },
        { ge: 0, divisor: 1, text: 'just now' },
    ];
	const nowDate = Date.now();
    const now = new Date(nowDate).getTime();
    const diff = now - (typeof date === 'object' ? date : new Date(date)).getTime();
    const diffAbs = Math.abs(diff);
    for (const interval of intervals) {
        if (diffAbs >= interval.ge) {
            const x = Math.round(Math.abs(diff) / interval.divisor);
            const isFuture = diff < 0;
            return interval.unit ? rft.format(isFuture ? x : -x, interval.unit as any) : interval.text;
        }
    }
}