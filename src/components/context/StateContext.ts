import { Entity } from "megalodon";
import { createContext } from "preact";
import { StateUpdater, useState } from "preact/hooks";

export const StateContext = createContext<
	| [
			{
				replyingTo: null | Entity.Status;
				mobileEditorOpened: boolean;
				notificationsOpened: boolean;
				path: string;
				sidebarOpened: boolean;
				quotingTo: null | Entity.Status;
				viewingConversation: string;
			},
			StateUpdater<{
				replyingTo: null | Entity.Status;
				mobileEditorOpened: boolean;
				notificationsOpened: boolean;
				path: string;
				sidebarOpened: false;
				quotingTo: null | Entity.Status;
				viewingConversation: string;
			}>,
	  ]
	| null
>(null);