import MetaTags from "components/head/MetaTags";
import Nav from "components/sidebar/Nav";
import { UserFeed } from "components/feed/UserFeed";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/context/AuthContext";
import { Response, Entity } from "megalodon";
import MainLayout from "components/layout/MainLayout";
import Home from "pages";

const User = () => {
	return (
		<>
			<Home />
		</>
	);
};

export default User;
