import { defineNuxtPlugin } from "#app";
import VWave from "v-wave";

// In this example, we rename the directive to `ripple`
const directiveName = "ripple";

export default defineNuxtPlugin(app => {
	const { vWave, vWaveTrigger } = VWave.createLocalWaveDirective(
		{},
		app.vueApp
	);

	app.vueApp.directive(directiveName, {
		...vWave,
		getSSRProps() {
			return {};
		},
	});
	app.vueApp.directive(`${directiveName}-trigger`, {
		...vWaveTrigger,
		getSSRProps() {
			return {};
		},
	});
});
