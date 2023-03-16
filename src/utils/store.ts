import { reactive, watch } from "vue";
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
	},
	notifications: {
		uuid: string,
		content: string,
		icon?: any,
		show: boolean
	}[],
	client: MegalodonInterface | null;
	replyingTo: null | Entity.Status;
	path: string;
	quotingTo: null | Entity.Status;
	viewingConversation: string;
	settingsOpen: boolean;
	theme: "light" | "dark";
	loaded: boolean;
	emojis: Entity.Emoji[];
}

let initialData: StateType = {
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

if (localStorage.getItem("store")) {
	initialData = JSON.parse(localStorage.getItem("store") as any ?? initialData);
}

export const store = reactive<StateType>(initialData);

watch(store, () => {
	localStorage.setItem("store", JSON.stringify(store));
}, {
	deep: true
})