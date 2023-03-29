<script setup lang="ts">
import {
	Dialog,
	TransitionRoot,
	TransitionChild,
	DialogPanel,
} from "@headlessui/vue";
import { store } from "../../utils/store";
import PostEditor from "./PostEditor.vue";
import ModalOverlay from "../modals/ModalOverlay.vue";

const closeModal = () => {
	store.state.composer = false;
	store.quotingTo = null;
	store.replyingTo = null;
};

const _window = window;
</script>

<template>
	<TransitionRoot :show="store.state.composer && (store.viewingConversation !== '' || _window.innerWidth < 768)"
		as="template">
		<Dialog as="div" class="block relative z-40" @close="closeModal">
			<ModalOverlay />
			<div
				class="flex justify-center fixed inset-0 no-scroll py-5 items-start p-2 md:items-center">
				<TransitionChild as="template" enter="ease-in-out duration-300" enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100" leave="ease-in duration-300" leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95">
					<DialogPanel class="relative w-full text-left transition-all transform sm:max-w-xl">
						<PostEditor/>
					</DialogPanel>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
