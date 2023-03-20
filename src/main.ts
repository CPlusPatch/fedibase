import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import HomeFeed from "./components/feed/HomeFeed.vue";
import LocalFeed from "./components/feed/LocalFeed.vue";
import FederatedFeed from "./components/feed/FederatedFeed.vue";
import UserFeed from "./components/feed/UserFeed.vue";
import Conversation from "./components/feed/Conversation.vue";
import { createRouter, createWebHistory } from "vue-router";
import { store } from "./utils/store";

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
