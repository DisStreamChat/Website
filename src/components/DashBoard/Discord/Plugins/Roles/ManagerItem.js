import { memo, useState, useEffect } from "react";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import firebase from "../../../../../firebase";
import {
	ManagerBody,
	ChannelParent,
} from "../../../../../styled-components/ReactionRoleComponents";
import AddActionButton from "./AddActionButton";
import ActionItem from "./ActionItem";
import CreateAction from "./CreateAction";

const ManagerItem = memo(({ guild, channel, actions, channelOveride, message, join, id }) => {
	const [displayChannel, setDisplayChannel] = useState();
	const [addingAction, setAddingAction] = useState(false);

	useEffect(() => {
		setDisplayChannel(guild.channels.find(c => c.id === channel));
	}, [channel, guild]);

	const deleteMe = async () => {
		await firebase.db
			.collection("reactions")
			.doc(guild.id)
			.update({ [`${id}`]: firebase.delete() });
	};

	return (
		<ManagerBody>
			<div className="delete-button" onClick={deleteMe}>
				<CancelTwoToneIcon />
			</div>
			<h4 style={{ marginBottom: "0px" }}>
				{displayChannel?.name || channelOveride}{" "}
				<ChannelParent> {displayChannel?.parent}</ChannelParent>
			</h4>
			{!join && <h5>Reactions</h5>}
			{Object.entries(actions || {})
				.sort()
				.map(([key, value]) => (
					<ActionItem
						key={key}
						deleteAble={!channelOveride}
						join={!channelOveride}
						message={message}
						emoji={key}
						guild={guild}
						{...value}
					/>
				))}
			{addingAction && (
				<CreateAction
					onSubmit={async (emoji, action) => {
						const docRef = firebase.db.collection("reactions").doc(guild.id);
						try {
							await docRef.update({
								[`${message}.actions.${emoji}`]: {
									...action,
									DMuser: !!action.DMuser,
								},
							});
						} catch (err) {
							await docRef.set({
								[`${message}.actions.${emoji}`]: {
									...action,
									DMuser: !!action.DMuser,
								},
							});
						}
					}}
					close={() => setAddingAction(false)}
					guild={guild}
					adding
					deleteAble={false}
				/>
			)}
			{!join && !addingAction && (
				<AddActionButton
					onClick={() => {
						setAddingAction(true);
					}}
					deleteAble={false}
					add
				></AddActionButton>
			)}
		</ManagerBody>
	);
});

export default ManagerItem;
