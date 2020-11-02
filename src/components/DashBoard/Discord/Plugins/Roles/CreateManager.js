import ClearIcon from "@material-ui/icons/Clear";

import { useState, useContext } from "react";

import { RoleContext } from "../../../../../contexts/RoleContext";
import firebase from "../../../../../firebase";
import CreateAction from "./CreateAction";
import ActionItem from "./ActionItem";
import AddActionButton from "./AddActionButton";
import StyledSelect from "../../../../../styled-components/StyledSelect";
import {
	channelLabel,
	parseSelectValue,
	TransformObjectToSelectValue,
} from "../../../../../utils/functions";
import { AppContext } from "../../../../../contexts/Appcontext";

const CreateManager = ({ guild: userConnectedGuildInfo }) => {
	const { state, update, error, setup } = useContext(RoleContext);
	const [addingAction, setAddingAction] = useState(false);
	const { userId } = useContext(AppContext);
	return (
		<>
			<div className="command-header">
				<h1>Create {state.type === "message" ? "Reaction" : "Join"} Role</h1>
				<button onClick={setup}>
					<ClearIcon />
				</button>
			</div>
			<div className="command-body">
				<div className="">
					<h4 className="plugin-section-title">Your Message</h4>
					<div className="plugin-section wide" style={{ flexDirection: "column" }}>
						<h4 className="plugin-section-title">Channel</h4>
						<StyledSelect
							value={state?.manager?.message?.channel}
							onChange={e => {
								update("manager.message.channel", e);
							}}
							options={userConnectedGuildInfo.channels.map(channel => ({
								value: TransformObjectToSelectValue(channel),
								label: channelLabel(channel),
							}))}
						/>
						<h4 className="plugin-section-title">Message</h4>
						<div className="message">
							<textarea
								value={state?.manager?.message?.content}
								onChange={e => update("manager.message.content", e.target.value)}
								placeholder="React to this message to get your roles!"
								name="reaction-message"
								id="reaction-message"
								cols="30"
								rows="10"
							></textarea>
						</div>
					</div>
					<h4 className="plugin-section-title">Reactions</h4>
					<div className="plugin-section">
						{Object.entries(state?.manager?.actions || {})?.map(([key, action]) => (
							<ActionItem
								edit={(action, emoji) => {
									update(`manager.actions[${emoji}]`, action);
								}}
								{...action}
								emoji={key}
								guild={userConnectedGuildInfo}
								deleteAble
								delete={() => {
									const prev = { ...state.manager.actions };
									delete prev[key];
									update("manager.actions", prev);
								}}
							></ActionItem>
						))}
						{addingAction && (
							<CreateAction
								close={() => setAddingAction(false)}
								index={(state.manager?.actions?.length || -1) + 1}
								guild={userConnectedGuildInfo}
								adding
								deleteAble={false}
							/>
						)}
						{!addingAction && (
							<AddActionButton
								onClick={() => {
									setAddingAction(true);
								}}
								add
								deleteAble={false}
							/>
						)}
					</div>
				</div>
			</div>
			<div className={`command-footer ${state.error?.message ? "error" : ""}`}>
				{state.error?.message && (
					<span className="error-message">{state.error?.message}</span>
				)}
				<button
					onClick={async () => {
						try {
							error(null);
							if (!state?.manager?.message?.channel) {
								return error("please choose a channel to post the message in.");
							}
							if (!state?.manager?.message?.content?.length)
								return error("Please write a message to post");
							const commandRef = firebase.db
								.collection("reactions")
								.doc(userConnectedGuildInfo.id);
							const manager = { ...state.manager };
							manager.message.channel = parseSelectValue(manager.message.channel);

							const otcData = (
								await firebase.db.collection("Secret").doc(userId).get()
							).data();
							const otc = otcData?.value;

							const apiUrl = `https://api.disstreamchat.com/discord/reactionmessage?otc=${otc}&id=${userId}`;
							const body = {
								message: manager.message.content,
								channel: manager.message.channel,
								reactions: Object.keys(manager.actions),
								server: userConnectedGuildInfo.id,
							};

							const response = await fetch(apiUrl, {
								method: "POST",
								body: JSON.stringify(body),
								headers: {
									Accept: "application/json",
									"Content-Type": "application/json",
								},
							});
							const json = await response.json();
							if (!response.ok || !json.messageId) {
								throw new Error(json.message);
							}

							const update = { [json.messageId]: manager };
							console.log(update);

							commandRef.update(update);

							setup();
						} catch (err) {
							error("Internal Error: " + err.message);
						}
					}}
				>
					{state.editing ? "Update" : "Create"}
				</button>
			</div>
		</>
	);
};

export default CreateManager;
