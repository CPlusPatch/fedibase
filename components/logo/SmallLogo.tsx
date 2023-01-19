import Image from "next/image";

const SmallLogo = ({ size }: { size: string }) => (
	<Image
		src={require("../../public/static/branding/logo.png")}
		alt="Orange gradient with the letters 'CPP' overlayed on it"
		className={`w-${size} h-${size} w-[2rem] h-[2rem]`}
	/>
);

export default SmallLogo;
