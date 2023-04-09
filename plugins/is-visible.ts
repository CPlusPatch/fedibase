export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive("is-visible", {
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
	});
})