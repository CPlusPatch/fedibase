/* This example requires Tailwind CSS v2.0+ */
import { useContext, useState } from "preact/hooks";
import { Menu, Transition } from "@headlessui/react";
import { IconDots, IconEye, IconEyeOff, IconForbid2, IconHandOff, IconVolume3 } from "@tabler/icons-preact";
import Button from "components/buttons/Button";
import { AuthContext } from "components/context/AuthContext";
import { Fragment } from "preact/jsx-runtime";
import { toast } from "react-hot-toast";

export default function ProfileActionsDropdown({
	user,
	initialRelationship,
}: {
	user: Entity.Account;
	initialRelationship: Entity.Relationship;
}) {
	const client = useContext(AuthContext);

	const [relationship, setRelationship] = useState<Entity.Relationship>(initialRelationship);

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="" as="div">
					<Button style="gray" className="!p-2">
						<IconDots className="h-6 w-6 md:h-5 md:w-5" aria-hidden="true" />
						<span className="sr-only">Open advanced settings</span>
					</Button>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95">
				<Menu.Items className="origin-top-right text-base absolute right-0 mt-2 w-44 overflow-hidden sm:text-sm rounded-md shadow-lg bg-white bg-dark divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none">
					<div>
						<Menu.Item>
							<button
								onClick={e => {
									e.preventDefault();

									if (relationship?.muting) {
										client?.unmuteAccount(user.id)
											.then(res => {
												setRelationship(res.data);
												toast.success("Account posts unhidden");
											})
											.catch(err => {
												console.error(err);
												toast.error("Couldn't unhide account posts :/");
											});
									} else {
										client?.muteAccount(user.id, false)
											.then(res => {
												setRelationship(res.data);
												toast.success("Account posts will now be hidden");
											})
											.catch(err => {
												console.error(err);
												toast.error("Couldn't hide account posts :/");
											});
									}
								}}
								href="#"
								className={
									"text-gray-700 w-full dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-200/10 group flex items-center px-4 py-3"
								}>
								{relationship?.muting ? (
									<>
										<IconEye
											className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500"
											aria-hidden="true"
										/>
										Show posts
									</>
								) : (
									<>
										<IconEyeOff
											className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500"
											aria-hidden="true"
										/>
										Hide posts
									</>
								)}
							</button>
						</Menu.Item>
						<Menu.Item>
							<button
								onClick={e => {
									e.preventDefault();

									if (relationship?.muting_notifications) {
										client?.unmuteAccount(user.id)
											.then(res => {
												setRelationship(res.data);
												toast.success("Accountunmuted");
											})
											.catch(err => {
												console.error(err);
												toast.error("Couldn't unmute account :/");
											});
									} else {
										client?.muteAccount(user.id, true)
											.then(res => {
												setRelationship(res.data);
												toast.success("Account is now muted");
											})
											.catch(err => {
												console.error(err);
												toast.error("Couldn't mute account :/");
											});
									}
								}}
								href="#"
								className={
									"text-gray-700 w-full dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-200/10 group flex items-center px-4 py-3"
								}>
								{relationship?.muting_notifications ? (
									<>
										<IconEye
											className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500"
											aria-hidden="true"
										/>
										Unmute
									</>
								) : (
									<>
										<IconVolume3
											className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500"
											aria-hidden="true"
										/>
										Mute
									</>
								)}
							</button>
						</Menu.Item>
						<Menu.Item>
							<button
								href="#"
								className={
									"text-gray-700 w-full dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-200/10 group flex items-center px-4 py-3"
								}>
								<IconForbid2
									className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500"
									aria-hidden="true"
								/>
								Block
							</button>
						</Menu.Item>
						<Menu.Item>
							<button
								href="#"
								className={
									"text-gray-700 w-full dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-200/10 group flex items-center px-4 py-3"
								}>
								<IconHandOff
									className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500"
									aria-hidden="true"
								/>
								Block domain
							</button>
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
