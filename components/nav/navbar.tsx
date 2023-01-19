import Link from "next/link";
import { Logo } from "./Logo";
import MobileNavbar from "./MobileNavbar";
import { FileEarmarkCodeFill } from "react-bootstrap-icons";
import { MobileHamburgerMenu } from "./MobileHamburgerMenu";
import { Popover } from "@headlessui/react";

export const nav = [
	{
		title: "Home",
		href: "/",
	},
	{
		title: "Skills",
		href: "/#skills",
	},
	{
		title: "Devices",
		href: "/devices",
	},
	{
		title: "CMS",
		href: "/blog",
	},
	{
		title: "Projects",
		href: "/projects",
	},
];

const Navbar = () => {

	return (
		<Popover
			className={`sticky top-0 z-30 backdrop-blur-lg duration-200 bg-white/30 font-poppins`}>
			<div
				className={`flex flex-row justify-between px-5 py-3 mx-auto max-w-7xl duration-300`}>
				<Logo />

				<MobileHamburgerMenu />
			</div>
		</Popover>
	);
};

export default Navbar;
