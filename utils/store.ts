import { Entity, MegalodonInterface } from "megalodon";

export interface StateType {
	auth: {
		token: string | null;
		clientId: string;
		data: Entity.Account | null;
		url: string;
		type: "mastodon" | "pleroma" | "misskey" | "";
		clientSecret: string;
		instance: Entity.Instance | null;
	};
	state: {
		composer: boolean;
		notifications: boolean;
		postViewer: boolean;
		sidebar: boolean;
		settingsOpen: boolean;
	};
	client: MegalodonInterface | null;
	replyingTo: null | Entity.Status;
	savedFeed: Entity.Status[];
	feedScroll: number;
	editing: null | Entity.Status;
	path: string;
	quotingTo: null | Entity.Status;
	viewingImage: Entity.Attachment | null;
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
		settingsOpen: false,
	},
	path: "",
	quotingTo: null,
	viewingImage: null,
	loaded: false,
	emojis: [],
};

export const useStore = defineStore("main", {
	// a function that returns a fresh state
	state: () => initialData,
	persist: {
		storage: localStorage,
	},
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
