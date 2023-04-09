import type { RouterConfig } from "@nuxt/schema";
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
	scrollBehavior(to, _from, savedPosition) {
		return new Promise(() => {
			setTimeout(() => {
				const feed = document.getElementById("feed");
				if (!feed) return;
				feed.scrollTop = savedPosition?.top ?? 0;
			}, 100);
		});
	},
};
