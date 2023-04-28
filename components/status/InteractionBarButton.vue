<template>
	<button
		v-ripple
		v-bind="$attrs"
		class="gap-x-2 flex items-center rounded h-8 justify-center static !shadow-none w-full border-none outline-none focus:outline-none">
		<slot />
	</button>
</template>
