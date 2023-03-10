import createStore from "teaful";

export interface StateType {
	auth: {
		token: string | null;
		clientId: string;
		id: string;
		url: string;
		type: "mastodon" | "pleroma" | "misskey" | "";
		clientSecret: string;
		handle: string;
	};
	replyingTo: null | Entity.Status;
	postComposerOpened: boolean;
	notificationsOpened: boolean;
	mobilePostViewer: boolean;
	path: string;
	sidebarOpened: boolean;
	quotingTo: null | Entity.Status;
	viewingConversation: string;
	settingsOpen: boolean;
	theme: "light" | "dark";
	loaded: boolean;
}

let initialState: StateType = {
	auth: {
		token: null,
		id: "",
		clientId: "",
		url: "",
		type: "",
		clientSecret: "",
		handle: "",
	},
	theme: "light",
	replyingTo: null,
	postComposerOpened: false,
	notificationsOpened: false,
	mobilePostViewer: false,
	path: "",
	sidebarOpened: false,
	quotingTo: null,
	viewingConversation: "",
	settingsOpen: false,
	loaded: false,
};

const storedStore = localStorage.getItem("store");

if (storedStore)
	initialState = {
		...JSON.parse(storedStore),
		loaded: true,
	};

export const { useStore, getStore, withStore } = createStore(initialState);
