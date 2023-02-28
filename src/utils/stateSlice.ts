import { Entity } from "megalodon";
import { StateType } from "./store";

const actions = (store: any) => ({
	setMobileEditorState: (state: StateType, value: boolean): StateType => {
		return {
			...state,
			postComposerOpened: value,
			notificationsOpened: false,
			sidebarOpened: false,
			replyingTo: value ? state.replyingTo : null,
			quotingTo: value ? state.quotingTo : null,
		};
	},
	setReplyingTo: (state: StateType, value: Entity.Status): StateType => {
		return {
			...state,
			replyingTo: value,
		};
	},
	setQuotingTo: (state: StateType, value: Entity.Status): StateType => {
		return {
			...state,
			quotingTo: value,
		};
	},
	setSidebarOpened: (state: StateType, value: boolean): StateType => {
		return {
			...state,
			sidebarOpened: value,
		};
	},
	setNotificationsSidebarOpened: (state: StateType, value: boolean): StateType => {
		return {
			...state,
			notificationsOpened: value,
		};
	},
	setViewingConversation: (state: StateType, value: string): StateType => {
		return {
			...state,
			viewingConversation: value,
		};
	},
	setPath: (state: StateType, value: string): StateType => {
		return {
			...state,
			path: value,
		};
	},
});

export default actions;