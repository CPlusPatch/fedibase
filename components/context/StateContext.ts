import { Entity } from "megalodon";
import { createContext, Dispatch, SetStateAction } from "react";

export const StateContext = createContext<{
		replyingTo: null | Entity.Status;
	} | null>(null);