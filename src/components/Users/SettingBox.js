import React, { useState, useEffect, useCallback } from "react";
import { Switch, NavLink, Route, Redirect, useParams } from "react-router-dom";
import SettingAccordion from "./SettingAccordion";
import Setting from "./Setting";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";

import { defaults } from "./userUtils";

const typesIndices = ["boolean", "color", "number"];

const SettingList = props => {
	const { key } = useParams();
	const [index, setIndex] = useState(key);
	const [settings, setSettings] = useState([]);

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
				.filter(([name]) => (!props.search ? true : name?.toLowerCase()?.includes(props.search)))
				.filter(([, details]) => details.category?.toLowerCase() === index?.toLowerCase() || props.all)
				.filter(([, details]) => (props.app ? true : !details.appOnly))
				.sort()
				.sort((a, b) => {
					return Math.sign(typesIndices.indexOf(a[1].type) - typesIndices.indexOf(b[1].type));
				})
				.map(([key, value]) => {
					return (
						<Setting
							default={defaults[key]}
							key={key}
							index={index}
							onChange={props.updateSettings}
							value={props?.settings?.[key]}
							name={key}
							type={value.type}
							min={value.min}
							max={value.max}
							step={value.step}
						/>
					);
				})}
		</SettingAccordion>
	);
};

const SettingBox = props => {
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
					{[...new Set(Object.values(props.defaultSettings || {}).map(val => val.category))]
						.sort()
						.filter(cat => (props.app ? true : cat.toLowerCase() !== "visibility"))
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
