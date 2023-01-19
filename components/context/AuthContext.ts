import generator, { MegalodonInterface } from "megalodon";
import { createContext } from "react";

export const AuthContext = createContext<MegalodonInterface>(generator("pleroma", process.env.NEXT_PUBLIC_INSTANCE_URL));