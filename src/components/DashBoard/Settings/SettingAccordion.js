import { Children, cloneElement, useCallback, useState } from "react";

const SettingAccordion = props => {
	const [openItem, setOpenItem] = useState();

	const clickHandler = useCallback(key => {
		setOpenItem(prev => {
			if (key === prev) {
				return "";
			} else {
				return key;
			}
		});
	}, []);

	return (
		<div style={{ width: "100%" }}>
			{Children.map(props.children, Element =>
				cloneElement(Element, {
					onClick: clickHandler,
					open: Element.props?.name === openItem,
				})
			)}
		</div>
	);
};

export default SettingAccordion;
