import generator, { MegalodonInterface } from "megalodon";
import { createContext } from "preact";

export const AuthContext = createContext<MegalodonInterface>(generator("pleroma", "https://mas.to"));