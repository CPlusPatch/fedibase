import { Entity, MegalodonInterface } from "megalodon";

export interface StateType {
	auth: {
		token: string | null;
		clientId: string;
		data: Entity.Account | null;
		url: string;
		type: "mastodon" | "pleroma" | "";
		clientSecret: string;
		instance: Entity.Instance | null;
	};
	state: {
		composer: boolean;
		notifications: boolean;
		postViewer: boolean;
		sidebar: boolean;
	};
	notifications: {
		uuid: string;
		content: string;
		icon?: any;
		show: boolean;
	}[];
	client: MegalodonInterface | null;
	replyingTo: null | Entity.Status;
	savedFeed: Entity.Status[];
	feedScroll: number;
	editing: null | Entity.Status;
	path: string;
	quotingTo: null | Entity.Status;
	viewingConversation: string;
	settingsOpen: boolean;
	theme: "light" | "dark";
	loaded: boolean;
	emojis: Entity.Emoji[];
}

const initialData: StateType = {
	auth: {
		token: null,
		data: null,
		clientId: "",
		url: "",
		type: "",
		clientSecret: "",
		instance: null,
	},
	notifications: [],
	client: null,
	theme: "light",
	replyingTo: null,
	editing: null,
	savedFeed: [],
	feedScroll: 0,
	state: {
		composer: false,
		notifications: false,
		postViewer: false,
		sidebar: false,
	},
	path: "",
	quotingTo: null,
	viewingConversation: "",
	settingsOpen: false,
	loaded: false,
	emojis: [],
};

export const useStore = defineStore("main", {
	// a function that returns a fresh state
	state: () => initialData,
	persist: true,
});

/* if (localStorage.getItem("store")) {
	initialData = JSON.parse(
		(localStorage.getItem("store") as any) ?? initialData
	);
}

export const store = reactive<StateType>(initialData);

watch(
	store,
	() => {
		localStorage.setItem("store", JSON.stringify(store));
	},
	{
		deep: true,
	}
); */
