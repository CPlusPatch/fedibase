<template>
	<ul
		id="feed"
		class="flex flex-col gap-y-4 px-8 py-4 no-scroll grow overflow-y-scroll"
		v-bind="$attrs">
		<slot />
	</ul>
</template>
