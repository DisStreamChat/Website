import React, { useState, useEffect, useCallback } from "react";
import { Switch, NavLink, Route, Redirect, useParams } from "react-router-dom";
import SettingAccordion from "./SettingAccordion";
import Setting from "./Setting";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { useContext } from "react";
import { DiscordContext } from "../../../contexts/DiscordContext";

const SettingList = props => {
	const { key } = useParams();
	const [index, setIndex] = useState(key);

	useEffect(() => {
		if (props.index) {
			setIndex(props.index);
		} else if (key) {
			setIndex(key);
		}
	}, [props, key]);

	return (
		<SettingAccordion>
			{Object.entries(props.defaultSettings || {})
				.filter(([name]) => (!props.search ? true : name?.toLowerCase()?.includes(props.search?.toLowerCase())))
				.filter(([, details]) => details.category?.toLowerCase() === index?.toLowerCase() || props.all)
				.filter(([, details]) => (props.app ? true : !details.appOnly))
				.filter(([, details]) => details.type !== "keybind")
				.sort((a, b) => {
					const categoryOrder = a[1].type.localeCompare(b[1].type);
					const nameOrder = a[0].localeCompare(b[0]);
					return !!categoryOrder ? categoryOrder : nameOrder;
				})
				.map(([key, value]) => {
                    if(!props.settings) return <></>
					return (
						<Setting
							default={value.value}
							key={key}
							index={index}
							onChange={props.updateSettings}
							value={props?.settings?.[key]}
							name={key}
							type={value.type}
							min={value.min}
							max={value.max}
							step={value.step}
							placeholder={value.placeholder}
							options={value.options}
						/>
					);
				})}
		</SettingAccordion>
	);
};

const SettingBox = props => {
    const {userDiscordInfo} = useContext(DiscordContext)
    const [search, setSearch] = useState("");

	const handleChange = useCallback(e => {
		setSearch(e.target.value);
	}, []);

	const resetSearch = useCallback(() => {
		setSearch("");
	}, []);

	useEffect(() => {
		setSearch("");
	}, [props.app]);

	return (
		<>
			<h1>{props.title}</h1>
			<h3>{props.subtitle}</h3>
			<hr />
			<span className="search-container">
				<input value={search} onChange={handleChange} type="text" name="" id="" placeholder="Search" className="settings--searchbox" />
				<ClearRoundedIcon className="clear-button" onClick={resetSearch} />
			</span>

			<span className="settings-sub-body">
				<div className="settings-categories">
					<NavLink activeClassName="active-category" className="category" to={`${props.parenturl}/${props.path}/all`}>
						All
					</NavLink>
					{userDiscordInfo && <NavLink activeClassName="active-category" className="category" to={`${props.parenturl}/${props.path}/discord`}>
						Discord
					</NavLink>}
					{[...new Set(Object.values(props.defaultSettings || {}).map(val => val.category))]
						.sort()
						.filter(cat => (cat ? (props.app ? true : cat.toLowerCase() !== "visibility") : false))
						.map(key => (
							<NavLink activeClassName="active-category" className="category" to={`${props.parenturl}/${props.path}/${key}`} key={key}>
								{key}
							</NavLink>
						))}
				</div>
				<Switch>
					<Route path={`${props.parenturl}/${props.path}/all`}>
						<SettingList
							defaultSettings={props.defaultSettings}
							settings={props.settings}
							updateSettings={props.updateSettings}
							all
							search={search}
							app={props.app}
						/>
					</Route>
					{userDiscordInfo && <Route path={`${props.parenturl}/${props.path}/discord`}>
						<SettingAccordion>
							<Setting name={"Discord Connection"} type={"Discord"} />
						</SettingAccordion>
					</Route>}
					{Object.keys(props.settings || {}).map(key => (
						<Route path={`${props.parenturl}/${props.path}/:key`}>
							<SettingList
								settings={props.settings}
								defaultSettings={props.defaultSettings}
								updateSettings={props.updateSettings}
								app={props.app}
								search={search}
							/>
						</Route>
					))}
					<Redirect to={`${props.parenturl}/${props.path}/all`} />
				</Switch>
			</span>
		</>
	);
};

export default SettingBox;
