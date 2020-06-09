import React from 'react';


const A = props => {
    return (
        <a href={props.href} className={props.className} target={props.newTab && "_blank"} rel={props.newTab && "noopener noreferrer"}>{props.children}</a>
    );
}

export default A;
