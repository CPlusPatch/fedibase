import createStore from "teaful";

export interface StateType {
	replyingTo: null | Entity.Status;
	postComposerOpened: boolean;
	notificationsOpened: boolean;
	path: string;
	sidebarOpened: boolean;
	quotingTo: null | Entity.Status;
	viewingConversation: string;
}

const initialState: StateType = {
	replyingTo: null,
	postComposerOpened: false,
	notificationsOpened: false,
	path: "",
	sidebarOpened: false,
	quotingTo: null,
	viewingConversation: "",
};
export const { useStore, getStore, withStore } = createStore(initialState);
