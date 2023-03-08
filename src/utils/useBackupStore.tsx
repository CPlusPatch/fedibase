import { useEffect } from "preact/hooks";
import { useStore } from "./store";

export const useBackupStore = () => {
	const [store, setStore] = useStore();

	useEffect(() => {
		const timeout = setTimeout(() => {
			localStorage.setItem("store", JSON.stringify(store));
		}, 200);

		return () => clearTimeout(timeout);
	}, [store]);

	return { store, setStore };
};
