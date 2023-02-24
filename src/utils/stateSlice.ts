import { createSlice } from "@reduxjs/toolkit";
import { Entity } from "megalodon";

export interface StateType {
	replyingTo: null | Entity.Status;
	postComposerOpened: boolean;
	notificationsOpened: boolean;
	path: string;
	sidebarOpened: boolean;
	quotingTo: null | Entity.Status;
	viewingConversation: string;
}

const stateSlice = createSlice({
	name: "state",
	initialState: {
		replyingTo: null,
		postComposerOpened: false,
		notificationsOpened: false,
		path: "/",
		sidebarOpened: false,
		quotingTo: null,
		viewingConversation: "",
	},
	reducers: {
		setMobileEditorState: (state, action) => {
			state.postComposerOpened = action.payload;
			state.notificationsOpened = false;
			state.sidebarOpened = false;

			if (action.payload === false) {
				state.replyingTo = null;
				state.quotingTo = null;
			}
		},
		setReplyingTo: (state, action) => {
			state.replyingTo = action.payload;
		},
		setQuotingTo: (state, action) => {
			state.quotingTo = action.payload;
		},
		setSidebarOpened: (state, action) => {
			state.sidebarOpened = action.payload;
		},
		setNotificationsSidebarOpened: (state, action) => {
			state.notificationsOpened = action.payload;
		},
		setViewingConversation: (state, action) => {
			state.viewingConversation = action.payload;
		},
		setPath: (state, action) => {
			state.path = action.payload;
		}
	},
});

export const { setMobileEditorState, setReplyingTo, setPath, setQuotingTo, setViewingConversation, setSidebarOpened, setNotificationsSidebarOpened } = stateSlice.actions;

export default stateSlice.reducer;