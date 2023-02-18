import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument(/* { props } */) {
	return (
		<Html lang="en-us" /* className={props.isDarkTheme ? "dark" : ""} */ className="dark">
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

/* MyDocument.getInitialProps = async (ctx) => {
	const initialProps = await Document.getInitialProps(ctx);
	const cookies = new Cookies(ctx.req, ctx.res);
	const isDarkTheme = cookies.get('theme') === 'dark';

	return { ...initialProps, props: {
		isDarkTheme,
	} };
} */