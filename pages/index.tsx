import type { NextPage } from "next";
import Navbar from "components/nav/navbar";
import Footer from "components/footer/footer";
import Faqs from "components/landing/Faqs";
import StackPresentation from "components/landing/OpenSourceWorkflow";
import Testimonials from "components/landing/Testimonials";
import MainText from "components/landing/MainText";
import BigHero from "components/landing/BigHero";
import NoScriptBanner from "components/banners/NoScriptBanner";
import Certifications from "components/landing/Certifications";
import { Account } from "types/types";
import MetaTags from "components/head/MetaTags";
import Skills from "components/landing/Skills";
import LightHouseScores from "components/landing/LighthouseScores";

const Home: NextPage = ({ account }: { account: Account | false }) => {
	return (
		<div className="relative bg-gray-50">
			<MetaTags title={`${process.env.NEXT_PUBLIC_AUTHOR_NAME} · Web Development`} />
			<Navbar account={account} />
			<main>
				<div className="overflow-hidden relative">
					{/* Little SVG dots */}
					<MainText />
					{/* <BigHero /> */}
					<Skills />
					<StackPresentation />
					<LightHouseScores />
					<Certifications />
					<Testimonials />
					<Faqs />
					<Footer />
					<NoScriptBanner />
					{/* {music && <MusicPlayer />}
					<MusicWidget setOpen={setMusic} /> */}
				</div>
			</main>
		</div>
	);
};

const AnnoyingSvgDots = () => {
	return (
		<div className="absolute inset-y-0 w-full h-96 -z-20" aria-hidden="true">
			<div className="relative h-auto">
				<svg
					className="hidden absolute right-full transform translate-x-1/4 translate-y-1/3 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full md:block"
					width={404}
					height={584}
					fill="none"
					viewBox="0 0 404 184">
					<defs>
						<pattern
							id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
							x={0}
							y={0}
							width={20}
							height={20}
							patternUnits="userSpaceOnUse">
							<rect
								x={0}
								y={0}
								width={4}
								height={4}
								className="text-gray-200"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width={404}
						height={284}
						fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)"
					/>
				</svg>
				<svg
					className="absolute left-full transform -translate-x-1/4 -translate-y-3/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
					width={404}
					height={784}
					fill="none"
					viewBox="0 0 404 784">
					<defs>
						<pattern
							id="d2a68204-c383-44b1-b99f-42ccff4e5365"
							x={0}
							y={0}
							width={20}
							height={20}
							patternUnits="userSpaceOnUse">
							<rect
								x={0}
								y={0}
								width={4}
								height={4}
								className="text-gray-200"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width={404}
						height={784}
						fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)"
					/>
				</svg>
			</div>
		</div>
	);
};

export default Home;
