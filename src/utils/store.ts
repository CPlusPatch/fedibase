import createStore from "teaful";

export interface StateType {
	replyingTo: null | Entity.Status;
	postComposerOpened: boolean;
	notificationsOpened: boolean;
	mobilePostViewer: boolean
	path: string;
	sidebarOpened: boolean;
	quotingTo: null | Entity.Status;
	viewingConversation: string;
	settingsOpen: boolean;
}

const initialState: StateType = {
	replyingTo: null,
	postComposerOpened: false,
	notificationsOpened: false,
	mobilePostViewer: false,
	path: "",
	sidebarOpened: false,
	quotingTo: null,
	viewingConversation: "",
	settingsOpen: false
};

export const { useStore, getStore, withStore } = createStore(initialState);
