<script setup lang="ts">
import { Entity } from 'megalodon';
import { ref } from 'vue';
import { store } from '../../utils/store';
import Feed, { FeedType } from './Feed.vue';
import UserProfile from '../profiles/UserProfile.vue';

const props = defineProps<{
	id: string;
}>();

const account = ref<Entity.Account | null>(null);

store.client?.getAccount(props.id).then(res => {
	account.value = res.data;
});
</script>

<template>
	<div v-if="account" class="flex overflow-y-scroll w-full h-full flex-col gap-y-6 px-6 py-4 no-scroll">
		<UserProfile :account="account" />
		<Feed :type="FeedType.User" :id="account.id"/>
	</div>
</template>