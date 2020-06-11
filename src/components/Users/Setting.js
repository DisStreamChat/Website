import React, {useState} from 'react';
import { ChromePicker } from "react-color"
import { useEffect } from 'react';
import { Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import "./Users.css"


const FancySwitch = withStyles({
    root: {
        padding: 7,
    },
    thumb: {
        width: 24,
        height: 24,
        backgroundColor: '#fff',
        boxShadow:
            '0 0 12px 0 rgba(0,0,0,0.08), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 4px 0 rgba(0,0,0,0.38)',
    },
    switchBase: {
        color: 'rgba(0,0,0,0.38)',
        padding: 7,
    },
    track: {
        borderRadius: 20,
        backgroundColor: blueGrey[300],
    },
    checked: {
        '& $thumb': {
            backgroundColor: '#fff',
        },
        '& + $track': {
            opacity: '1 !important',
        },
    },
    focusVisible: {},
})(Switch);

const Setting = props => {
    const [value, setValue] = useState(props.value)
    const [open, setOpen] = useState(false)
    
    const changeHandler = v => {
        props.onChange(props.name, v)
    }

    useEffect(() => {
        if (props.type === "color") {
            setValue(props.value || props.default)
        }else{
            setValue(props.value)
        }
    }, [props])

    return (
        <div className={`setting ${props.type === "color" && "color-setting"} ${open && "open"}`}>
            {props.type === "color" ? 
                <>
                    <div className="color-header" onClick={() => setOpen(o => !o)}>
                        <KeyboardArrowDownIcon className={`${open ? "open" : "closed"} mr-quarter`}/>
                        <h3>{props.name}</h3>
                        <div className="color-preview" style={{
                            background: value || "#000",
                        }}></div>
                    </div>
                    <ChromePicker
                        color={value}
                        onChange={color => changeHandler(color.hex)}
                        disableAlpha
                        className="ml-1"
                    />
                    <button className="reset-button" onClick={() => changeHandler(props.default)}>reset</button>
                </>
                :
                <span className="checkbox-setting">
                    <FormControlLabel control={<FancySwitch color="primary" checked={value} onChange={e => changeHandler(e.target.checked)} name={props.name} />} label={props.name}/>
                </span>
            }
        </div>
    );
}

export default Setting;
