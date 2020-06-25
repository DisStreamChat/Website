import React, { useState, useEffect } from "react";
import SettingAccordion from "./SettingAccordion";
import Setting from "./Setting";
import { useParams } from "react-router-dom";

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
				.sort((a, b) => {
                    const categoryOrder = (a[1].type.localeCompare(b[1].type));
                    const nameOrder = a[0].localeCompare(b[0])
					return !!categoryOrder ? categoryOrder : nameOrder
				})
				.map(([key, value]) => {
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
						/>
					);
				})}
		</SettingAccordion>
	);
};

export default SettingList