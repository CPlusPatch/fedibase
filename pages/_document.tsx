import { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument(/* { props } */) {
	return (
    <Html lang='en-us' /* className={props.isDarkTheme ? "dark" : ""} */>
		<Head>
		</Head>

		<body>
			<Main />
			<NextScript />
		</body>
    </Html>
	)
}

/* MyDocument.getInitialProps = async (ctx) => {
	const initialProps = await Document.getInitialProps(ctx);
	const cookies = new Cookies(ctx.req, ctx.res);
	const isDarkTheme = cookies.get('theme') === 'dark';

	return { ...initialProps, props: {
		isDarkTheme,
	} };
} */