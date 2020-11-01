import { useState, useContext } from "react";
import RoleItem from "../../../../../styled-components/RoleItem";
import Twemoji from "react-twemoji";
import { RoleContext } from "../../../../../contexts/RoleContext";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import FancySwitch from "../../../../../styled-components/FancySwitch";
import { REACTION_ROLE_ACTION_TYPES } from "../../../../../utils/constants";
import StyledSelect from "../../../../../styled-components/StyledSelect";
import {
	ActionBody,
	ActionFooter,
	ActionButton,
	ActionHead,
} from "../../../../../styled-components/ReactionRoleComponents";

const CreateAction = ({ guild, onSubmit, close }) => {
	const [action, setAction] = useState({
		type: "TOGGLE",
	});
	console.log(action);
	const { update } = useContext(RoleContext);
	const [open, setOpen] = useState(false);

	const submit = () => {
		const roleIDs = action.role.map(role => JSON.parse(role.value.split("=")[1]).id);
		console.log(roleIDs);
		const actionObj = {
			role: roleIDs,
			type: action.type,
			DMuser: !!action.DMuser,
		};
		if (onSubmit) {
			onSubmit(action.emoji, actionObj);
		} else {
			update(`manager.actions[${action.emoji}]`, actionObj);
		}
		return close?.();
	};

	return (
		<ActionBody style={{ zIndex: 1000 }}>
			<ActionHead>
				<div>
					{action.emoji ? (
						<span style={{ marginRight: ".5rem", textTransform: "capitalize" }}>
							<Twemoji options={{ className: "twemoji" }}>
								{action.emoji?.replace("catch-all", "All").replace("-", " ")}
							</Twemoji>
						</span>
					) : (
						<Picker
							theme="dark"
							style={{ position: "absolute", top: ".75rem", zIndex: 100 }}
							set="twitter"
							title="Pick your emoji…"
							emoji="point_up"
							onSelect={emoji =>
								setAction(prev => ({ ...action, emoji: emoji.native }))
							}
						/>
					)}
				</div>
				<div>
					{/* Roles:{" "} */}
					<div style={{ marginLeft: ".5rem", width: "100%" }}>
						<StyledSelect
							isMulti
							closeMenuOnSelect={false}
							onChange={e => {
								setAction(prev => ({ ...prev, role: e }));
							}}
							placeholder="Select Reaction Roles"
							value={action.role || ""}
							options={guild?.roles
								?.filter(role => role.name !== "@everyone" && !role.managed)
								?.sort((a, b) => b.rawPosition - a.rawPosition)
								?.map(role => ({
									value: `${role.name}=${JSON.stringify(role)}`,
									label: <RoleItem {...role}>{role.name}</RoleItem>,
								}))}
						/>
					</div>
				</div>
				<div>
					<ActionButton onClick={() => setOpen(prev => !prev)}>
						<KeyboardArrowDownIcon />
					</ActionButton>
					{action.role && action.type && action.emoji && (
						<ActionButton onClick={submit}>
							<CheckIcon />
						</ActionButton>
					)}
					<ActionButton onClick={() => close?.()}>
						<CloseIcon />
					</ActionButton>
				</div>
			</ActionHead>
			<ActionFooter open={open}>
				<span>
					<FormControlLabel
						control={
							<FancySwitch
								color="primary"
								checked={action.emoji === "catch-all"}
								onChange={e => {
									if (e.target.checked) {
										setAction(prev => ({ ...prev, emoji: "catch-all" }));
									} else {
										setAction(prev => ({ ...prev, emoji: null }));
									}
								}}
								name={"catch-all"}
							/>
						}
						label={"ALL"}
					/>
				</span>
				<div style={{ marginLeft: ".5rem", width: "50%" }}>
					<StyledSelect
						onChange={e => {
							setAction(prev => ({ ...prev, type: e.value }));
						}}
						placeholder="Select Action Type"
						value={
							action?.type
								? {
										value: action?.type,
										label: `Action Type: ${REACTION_ROLE_ACTION_TYPES[action?.type]}`,
								  }
								: ""
						}
						options={Object.entries(REACTION_ROLE_ACTION_TYPES || {})?.map(
							([key, value]) => ({
								value: key,
								label: value,
							})
						)}
					/>
				</div>
				<div style={{ paddingLeft: ".75rem" }}>
					<FormControlLabel
						control={
							<FancySwitch
								color="primary"
								checked={!!action.DMuser}
								onChange={e => {
									setAction(prev => ({ ...prev, DMuser: e.target.checked }));
								}}
								name={"dm_user"}
							/>
						}
						label={"DM"}
					/>
				</div>
			</ActionFooter>
		</ActionBody>
	);
};

export default CreateAction;
