<template>
	<ul
		class="flex flex-col gap-y-4 px-4 py-4 no-scroll grow overflow-y-scroll"
		v-bind="$attrs">
		<slot />
	</ul>
</template>
