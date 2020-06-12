import React from "react";
import { useCallback, useState } from "react";

const SettingAccordion = props => {
    const [openItem, setOpenItem] = useState()

    const clickHandler = useCallback(key => {
        if(key === openItem){
            setOpenItem("")
        }else{
            setOpenItem(key)
        }
    }, [openItem])

    return (
        <div style={{width: "100%"}}>
            {props.children.map(Element => (
                React.cloneElement(Element, {onClick: clickHandler, open: Element.props.name === openItem})
            ))}
        </div>
    );
}

export default SettingAccordion;
