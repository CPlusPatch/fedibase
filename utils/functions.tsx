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
 * Turns a string of HTML into a JSX element with emojis parsed
 * @param string String of HTML to render
 * @param emojis List of emojis in the text
 * @returns JSX element of rendered HTML with the emoji
 */
export function withEmojis(string: string, emojis: Entity.Emoji[]) {
		const blocks = string.split(":");

		let renderedHtml = "";
		
		blocks.map((block, index) => {
			let html = block;
			emojis.map((emoji, index2) => {
				if (block == emoji.shortcode) {
					html = `<img src="${emoji.url}" alt="" style="height: 1em; display: inline;"/>`;
				}
			});
			renderedHtml += html;
		});

		return <span dangerouslySetInnerHTML={{ __html: renderedHtml }}></span>;
}