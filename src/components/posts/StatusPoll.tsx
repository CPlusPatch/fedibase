import { Button } from "@cpluspatch/catgirl-ui";
import { AuthContext } from "components/context/AuthContext";
import { StateUpdater, useContext } from "preact/hooks";
import { fromNow } from "utils/functions";

export function StatusPoll({
	status,
	setStatus,
}: {
	status: Entity.Status;
	setStatus: StateUpdater<Entity.Status>
}) {
	const client = useContext(AuthContext);
	
	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				const value = [];

				if (!status.poll) return false;

				for (let i = 0; i < (e.target as any)["poll"].length; i++) {
					if ((e.target as any)["poll"][i].checked)
						value.push((e.target as any)["poll"][i].value);
				}
				client?.votePoll(status.poll?.id, value, status.id).then(res => {
					setStatus(s => ({
						...s,
						poll: res.data,
					}));
				});
			}}
			action="#"
			className="list-inside flex-col gap-y-2 flex">
			<fieldset>
				{status.poll?.options.map((option, index) => (
					<li
						key={index}
						className="flex flex-row gap-x-1 items-center relative dark:text-gray-100">
						<div
							style={{
								width: `${Math.round(
									(option.votes_count ?? 0 / (status.poll?.votes_count ?? 0)) *
										100,
								)}%`,
							}}
							className="absolute max-w-full bg-orange-200 dark:bg-orange-800 rounded h-full z-0"></div>
						<span className="w-10 z-10">
							{Number.isNaN(
								Math.round(
									(option.votes_count ?? 0 / (status.poll?.votes_count ?? 0)) *
										100,
								),
							)
								? 0
								: Math.round(
									(option.votes_count ??
											0 / (status.poll?.votes_count ?? 0)) * 100,
								)}
							%
						</span>
						{!status.poll?.voted && (
							<input
								type={status.poll?.multiple ? "checkbox" : "radio"}
								name="poll"
								className="z-10 focus:outline-none focus:ring-0 rounded outline-none m-0 p-0"
								value={index}
							/>
						)}
						<span className="z-10">{option.title}</span>
					</li>
				))}
			</fieldset>
			<div className="text-sm text-gray-500 dark:text-gray-400">
				{!status.poll?.voted && (
					<Button style="gray" type="submit" className="!px-2 !py-1 mr-2">
						Vote
					</Button>
				)}
				{status.poll?.votes_count} people voted &middot;{" "}
				{status.poll?.expired ? <>Poll ended</> : <>Poll ends</>}{" "}
				{fromNow(new Date(status.poll?.expires_at ?? ""))}
			</div>
		</form>
	);
}