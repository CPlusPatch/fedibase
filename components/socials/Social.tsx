import Head from "next/head"
import FediVerification from "./FediFerification";

const SocialRedirector = ({ link }: { link: string }) => {
	return (
		<>
			<Head>
				<meta httpEquiv="Refresh" content={`0; URL=${link}`} />
			</Head>
			Redirecting to{" "}
			<a
				href={link}
				target="_blank"
				rel="noreferrer"
				className="text-blue-400 underline">
				{link}
			</a>
			...
			<FediVerification />
		</>
	);
}

export default SocialRedirector