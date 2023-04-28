import { computed, onMounted, onUnmounted, ref } from "vue";

const useWindowDimensions = () => {
	const windowWidth = ref(window.innerWidth);
	const windowHeight = ref(window.innerHeight);

	const onChange = () => {
		windowWidth.value = window.innerWidth;
		windowHeight.value = window.innerHeight;
	};
	onMounted(() => window.addEventListener("resize", onChange));
	onUnmounted(() => window.removeEventListener("resize", onChange));

	const width = computed(() => windowWidth.value);
	const height = computed(() => windowHeight.value);

	return { width, height };
};

export default useWindowDimensions;
