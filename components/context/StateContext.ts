import { Entity } from "megalodon";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const StateContext = createContext<
	[
		{
			replyingTo: null | Entity.Status;
			mobileEditorOpened: boolean;
			notificationsOpened: boolean;
			path: string;
			sidebarOpened: boolean;
		},
		Dispatch<
			SetStateAction<{
				replyingTo: null | Entity.Status;
				mobileEditorOpened: boolean;
				notificationsOpened: boolean;
				path: string;
				sidebarOpened: false;
			}>
		>,
	] | null
>(null);