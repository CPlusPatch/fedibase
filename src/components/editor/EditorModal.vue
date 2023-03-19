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
</script>

<template>
	<TransitionRoot :show="store.state.composer" as="template">
		<Dialog as="div" class="block relative z-40" @close="closeModal">
			<ModalOverlay />

			<div class="overflow-y-auto fixed inset-0 no-scroll py-5">
				<div
					class="flex justify-center items-start md:p-4 p-2 min-h-full text-center md:items-center sm:p-0">
					<TransitionChild
						as="template"
						enter="ease-in-out duration-200"
						enterFrom="opacity-0 translate-y-4 translate-y-0 scale-75"
						enterTo="opacity-100 translate-y-0 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 scale-100"
						leaveTo="opacity-0 translate-y-4 translate-y-0 scale-75">
						<DialogPanel
							class="relative w-full text-left transition-all transform sm:max-w-xl">
							<PostEditor />
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
