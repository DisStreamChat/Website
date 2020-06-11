import React from 'react';
import {Link} from "react-router-dom"

const Anchor = ({children, ...rest}) => {
    return <a {...rest}>{children}</a>
}

const A = props => {

    const elementProps = {
        href: props.local ? "": props.href,
        to: props.local ? props.href : "",
        className: props.className,
        target: props.newTab && "_blank",
        rel: props.newTab && "noopener noreferrer"
    }

    const Element = props.local ? Link : Anchor

    return (
        <Element {...elementProps}>{props.children}</Element>
    );
}

export default A;
