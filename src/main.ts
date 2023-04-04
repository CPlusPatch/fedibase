import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import HomeFeed from "./components/feed/HomeFeed.vue";
import LocalFeed from "./components/feed/LocalFeed.vue";
import FederatedFeed from "./components/feed/FederatedFeed.vue";
import UserFeed from "./components/feed/UserFeed.vue";
import Conversation from "./components/feed/Conversation.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{
		path: "/",
		component: HomeFeed,
	},
	{
		path: "/local",
		component: LocalFeed,
	},
	{
		path: "/federated",
		component: FederatedFeed,
	},
	{
		path: "/user/:id",
		component: UserFeed,
	},
	{
		path: "/posts/:id",
		component: Conversation,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes, // short for `routes: routes`,
	scrollBehavior: (to, _from, savedPosition) => {
		return new Promise(resolve => {
			setTimeout(() => {
				const feed = document.getElementById("feed")
				if (!feed) return;
				feed.scrollTop = savedPosition?.top ?? 0;
				/* console.log({
					...savedPosition,
					el: document.getElementById("feed") ?? "",
				});
				resolve(
					{
						...savedPosition,
						el: document.getElementById("feed") ?? "",
					} || { left: 0, top: 0}
				); */
			}, 100);
		});
	},
});

createApp(App)
	.use(router)
	.directive("is-visible", {
		mounted: (el, binding) => {
			const options = {
				rootMargin: "0px",
				threshold: 0.25,
			};
			const observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const callback = binding.value;
						if (typeof callback === "function") {
							callback();
						}
						observer.unobserve(el);
					}
				});
			}, options);
			observer.observe(el);
		},
	})
	.mount("#app");
