import { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import Document from "next/document";
import { getCookie } from "cookies-next";

export default function MyDocument({ theme }) {
	return (
		<Html lang="en-us">
			<Head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/images/icons/icon-512x512.png"></link>
				<meta name="theme-color" content="#fff" />
			</Head>

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
