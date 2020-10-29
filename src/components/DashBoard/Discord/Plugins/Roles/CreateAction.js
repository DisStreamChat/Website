import React, { useState, useContext } from "react";
import styled from "styled-components";
import RoleItem from "../../../../Shared/RoleItem";
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

const ActionButton = styled.div`
	cursor: pointer;
	&:first-child {
		transform: scale(1.5);
	}
`;

const ActionBody = styled.div`
	width: 100% !important;
	box-sizing: border-box;
	padding: 1rem;
	justify-content: space-between;
	margin: 0.25rem;
	margin-left: 0rem;
	background: #1a1a1a;
	position: relative;
	align-items: center;
	border-radius: 0.25rem;
	z-index: 100;
	h3,
	h2,
	h4,
	h1,
	p {
		margin: 0;
	}
	& > div:not(:first-child) {
		margin-left: 0.5rem;
		margin-right: 0.5rem;
	}
`;

const ActionHead = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	& > div {
		flex: 1;
		&:last-child,
		&:first-child {
			flex: 0.1;
		}
		&:first-child {
			display: flex;
			align-items: center;
			.twemoji {
				width: 50px;
			}
		}

		&:last-child {
			align-items: center;
			display: flex;
			justify-content: space-between;
			margin-left: 1.5rem;
		}
	}
`;

const ActionFooter = styled.div`
	overflow: ${props => (props.open ? "visible" : "hidden")};
	height: ${props => (props.open ? "100px" : "0px")};
	margin-top: 0.5rem;
	display: flex;
	padding-left: 0.5rem;
	align-items: center;
	margin-left: 0;
	justify-content: space-between;
	transition: height 0.25s;
	& > div {
		flex: 1;
		&:last-child,
		&:first-child {
			flex: 0.1;
		}
		&:first-child {
			display: flex;
			align-items: center;
			.twemoji {
				width: 50px;
			}
		}

		&:last-child {
			align-items: center;
			display: flex;
			justify-content: space-between;
			margin-left: 1.5rem;
		}
	}
`;

const CreateAction = ({ guild, onSubmit, close }) => {
	const [action, setAction] = useState({});
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
		<ActionBody>
			<ActionHead>
				<div>
					{action.emoji ? (
						<span style={{ marginRight: ".5rem", textTransform: "capitalize" }}>
							<Twemoji options={{ className: "twemoji" }}>{action.emoji?.replace("catch-all", "All").replace("-", " ")}</Twemoji>
						</span>
					) : (
						<Picker
							theme="dark"
							style={{ position: "absolute", top: ".75rem", zIndex: 100 }}
							set="twitter"
							title="Pick your emoji…"
							emoji="point_up"
							onSelect={emoji => setAction(prev => ({ ...action, emoji: emoji.native }))}
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
						value={action?.type ? { value: action?.type, label: REACTION_ROLE_ACTION_TYPES[action?.type] } : ""}
						options={Object.entries(REACTION_ROLE_ACTION_TYPES || {})?.map(([key, value]) => ({
							value: key,
							label: value,
						}))}
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
