interface MetaTagsTypes {
	title: string;
	description?: string;
	author?: string;
	type?: string;
	image?: string;
}

export default function MetaTags({
	title, description = "", author = "", type = "", image = ""
}: MetaTagsTypes) {
	return (
		{/* <Head>
			<title>{title}</title>
			<meta
				name="title"
				content={title}
			/>
			<meta name="description" content={description} />
			<meta name="author" content={author} />

			<meta property="og:type" content={type} />
			<meta
				property="og:url"
				content={process.env.NEXT_PUBLIC_HOSTNAME}
			/>
			<meta
				property="og:title"
				content={title}
			/>
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
		</Head> */}
	);
}