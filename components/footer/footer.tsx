import {
	Github,
	Envelope,
	Mastodon,
	StackOverflow,
} from "react-bootstrap-icons";

const socials = [
	{
		name: "GitHub",
		href: "https://github.com/CPlusPatch",
		icon: <Github size={24} aria-hidden="true" />,
	},
	{
		name: "Codeberg",
		href: "https://codeberg.org/CPlusPatch",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				version="1.1"
				viewBox="0 0 4.233 4.233"
				className="w-6 h-6">
				<defs>
					<linearGradient
						x1="42519.285"
						x2="42575.336"
						y1="-7078.789"
						y2="-6966.931"
						gradientUnits="userSpaceOnUse"
						xlinkHref="#linearGradient6924"></linearGradient>
					<linearGradient id="linearGradient6924">
						<stop
							offset="0"
							stopColor="currentColor"
							stopOpacity="0"></stop>
						<stop
							offset="0.495"
							stopColor="currentColor"
							stopOpacity="0.489"></stop>
						<stop
							offset="1"
							stopColor="currentColor"
							stopOpacity="0.633"></stop>
					</linearGradient>
					<linearGradient
						id="linearGradient6918-3"
						x1="42519.285"
						x2="42575.336"
						y1="-7078.789"
						y2="-6966.931"
						gradientUnits="userSpaceOnUse"
						xlinkHref="#linearGradient6924-6"></linearGradient>
					<linearGradient id="linearGradient6924-6">
						<stop
							offset="0"
							stopColor="currentColor"
							stopOpacity="0"></stop>
						<stop
							offset="0.495"
							stopColor="currentColor"
							stopOpacity="0.3"></stop>
						<stop
							offset="1"
							stopColor="currentColor"
							stopOpacity="0.3"></stop>
					</linearGradient>
				</defs>
				<g
					fillOpacity="1"
					transform="matrix(.06551 0 0 .06551 -2.232 -1.432)">
					<path
						style={{ fontVariationSettings: "normal" }}
						fill="url(#linearGradient6918-3)"
						stroke="none"
						strokeDasharray="none"
						strokeDashoffset="0"
						strokeLinecap="butt"
						strokeLinejoin="miter"
						strokeMiterlimit="2"
						strokeOpacity="1"
						strokeWidth="3.678"
						d="M42519.285-7078.79a.76.568 0 00-.738.675l33.586 125.888a87.182 87.182 0 0039.381-33.763l-71.565-92.52a.76.568 0 00-.664-.28z"
						opacity="1"
						paintOrder="stroke markers fill"
						stopColor="currentColor"
						stopOpacity="1"
						transform="matrix(.37058 0 0 .37058 -15690.065 2662.053)"
						vectorEffect="none"></path>
					<path
						fill="currentColor"
						strokeWidth="17.006"
						d="M11249.461-1883.696c-12.74 0-23.067 10.327-23.067 23.067 0 4.333 1.22 8.58 3.522 12.251l19.232-24.863c.138-.18.486-.18.624 0l19.233 24.864a23.068 23.068 0 003.523-12.252c0-12.74-10.327-23.067-23.067-23.067z"
						opacity="1"
						paintOrder="markers fill stroke"
						stopColor="#000"
						transform="matrix(1.40064 0 0 1.40064 -15690.065 2662.053)"></path>
				</g>
			</svg>
		),
	},
	{
		name: "E-mail",
		href: "mailto:contact@cpluspatch.com",
		icon: <Envelope size={24} aria-hidden="true" />,
	},
	{
		name: "Mastodon",
		href: "https://social.linux.pizza/web/@jesse",
		icon: <Mastodon size={24} aria-hidden="true" />,
	},
	{
		name: "StackOverflow",
		href: "https://stackoverflow.com/users/12187615/cpluspatch",
		icon: <StackOverflow size={24} aria-hidden="true" />,
	},
	{
		name: "Matrix",
		href: "https://matrix.to/#/@cpluspatch:cplushpatch.party",
		icon: (
			<svg
				version="1.1"
				viewBox="0 0 27.9 32"
				xmlns="http://www.w3.org/2000/svg"
				className="w-6 h-6"
				aria-hidden="true">
				<g transform="translate(-.095 .005)" fill="currentColor">
					<path d="m27.1 31.2v-30.5h-2.19v-0.732h3.04v32h-3.04v-0.732z" />
					<path d="m8.23 10.4v1.54h0.044c0.385-0.564 0.893-1.03 1.49-1.37 0.58-0.323 1.25-0.485 1.99-0.485 0.72 0 1.38 0.14 1.97 0.42 0.595 0.279 1.05 0.771 1.36 1.48 0.338-0.5 0.796-0.941 1.38-1.32 0.58-0.383 1.27-0.574 2.06-0.574 0.602 0 1.16 0.074 1.67 0.22 0.514 0.148 0.954 0.383 1.32 0.707 0.366 0.323 0.653 0.746 0.859 1.27 0.205 0.522 0.308 1.15 0.308 1.89v7.63h-3.13v-6.46c0-0.383-0.015-0.743-0.044-1.08-0.0209-0.307-0.103-0.607-0.242-0.882-0.133-0.251-0.336-0.458-0.584-0.596-0.257-0.146-0.606-0.22-1.05-0.22-0.44 0-0.796 0.085-1.07 0.253-0.272 0.17-0.485 0.39-0.639 0.662-0.159 0.287-0.264 0.602-0.308 0.927-0.052 0.347-0.078 0.697-0.078 1.05v6.35h-3.13v-6.4c0-0.338-7e-3 -0.673-0.021-1-0.0114-0.314-0.0749-0.623-0.188-0.916-0.108-0.277-0.3-0.512-0.55-0.673-0.258-0.168-0.636-0.253-1.14-0.253-0.198 0.0083-0.394 0.042-0.584 0.1-0.258 0.0745-0.498 0.202-0.705 0.374-0.228 0.184-0.422 0.449-0.584 0.794-0.161 0.346-0.242 0.798-0.242 1.36v6.62h-3.13v-11.4z" />
					<path d="m0.936 0.732v30.5h2.19v0.732h-3.04v-32h3.03v0.732z" />
				</g>
			</svg>
		),
	},
];

const Footer = () => {
	// This button is camouflaged as a "contact" button, but when shift-clicked redirects to the login page
	const handleSecretLogin = (event: any) => {
		event.preventDefault();
		if (event.shiftKey) window.location.href = "/auth/login";
	};

	return (
		<footer className="">
			<div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:flex md:items-center md:justify-between lg:px-8 font-inter">
				<div
					id="contact"
					className="flex justify-center space-x-6 ring-blue-500 md:order-2 focus:ring-1">
					{socials.map((item) => {
						return (
							<a
								key={item.name}
								href={item.href}
								className="text-gray-400 hover:text-gray-500">
								<span className="sr-only">{item.name}</span>
								{item.icon}
							</a>
						);
					})}
					<button
						onClick={handleSecretLogin}
						className="text-gray-400 hover:text-gray-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							className="w-6 h-6"
							viewBox="0 0 16 16">
							<path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" />
						</svg>
					</button>
				</div>
				<div className="mt-8 md:mt-0 md:order-1">
					<p className="text-base text-center text-gray-600">
						&copy; {new Date().getFullYear()}{" "}
						{process.env.NEXT_PUBLIC_AUTHOR_NAME}. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
