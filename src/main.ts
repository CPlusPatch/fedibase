import { createApp } from 'vue'
import './index.css';
import App from './App.vue';

createApp(App)
	.directive('is-visible', {
		mounted: (el, binding) => {
			const options = {
				rootMargin: '0px',
				threshold: 0.25
			};
			const observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
					const callback = binding.value;
					if (typeof callback === 'function') {
						callback();
					}
					observer.unobserve(el);
					}
				});
			}, options);
			observer.observe(el);
		}
	})
	.mount("#app");
