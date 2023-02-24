/*
* Copyright (C) 2023 CPlusPatch
* 
* This program is free software: you can redistribute it and/or modify it under the terms of the GNU General
* Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
* option) any later version.

* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
* implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
* for more details.

* You should have received a copy of the GNU General Public License along with this program.  If not, see 
* <http://www.gnu.org/licenses/>.
*/
import generator from "megalodon";
import { AuthContext } from "./components/context/AuthContext";
import Index from "index";

export function App() {

	return (
		<>
			<AuthContext.Provider
				value={
					typeof window !== "undefined" &&
					localStorage.getItem("accessToken") &&
					localStorage.getItem("instanceType")
						? generator(
								localStorage.getItem("instanceType") as any,
								localStorage.getItem("instanceUrl"),
								localStorage.getItem("accessToken"),
							)
						: null
				}>
				<Index pathname={window.location.pathname} currentPath={window.location.pathname} />
			</AuthContext.Provider>
		</>
	);
}
