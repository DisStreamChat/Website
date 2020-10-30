import { useState, useEffect, } from "react";
import {     useParams } from "react-router-dom";
import SettingAccordion from "./SettingAccordion";
import Setting from "./Setting";
import { useMemo } from "react";

const SettingList = ({ search, app, all, defaultSettings, ...props }) => {
	const { key } = useParams();
	const [index, setIndex] = useState(key);

	useEffect(() => {
		if (props.index) {
			setIndex(props.index);
		} else if (key) {
			setIndex(key);
		}
	}, [props, key]);

	const displaySettings = useMemo(() => {
		return Object.entries(defaultSettings || {})
			.filter(([name]) => (!search ? true : name?.toLowerCase()?.includes(search?.toLowerCase())))
			.filter(([, details]) => details.category?.toLowerCase() === index?.toLowerCase() || all)
			.filter(([, details]) => (app ? true : !details.appOnly))
			.filter(([, details]) => details.type !== "keybind")
			.sort((a, b) => {
				const categoryOrder = a[1].type.localeCompare(b[1].type);
				const nameOrder = a[0].localeCompare(b[0]);
				return !!categoryOrder ? categoryOrder : nameOrder;
			});
	}, [index, all, app, defaultSettings, search]);

	return (
		<SettingAccordion>
			{displaySettings.map(([key, value]) => {
				if (!props.settings) return <></>;
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

export default SettingList