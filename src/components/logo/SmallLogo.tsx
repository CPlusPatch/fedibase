const SmallLogo = ({ size }: { size: string }) => (
	<img
		src={"/static/branding/logo.png"}
		alt="Orange gradient with the letters 'CPP' overlayed on it, my logo"
		className={`h-auto ${size}`}
	/>
);

export default SmallLogo;
