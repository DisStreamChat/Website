import React, {useState} from 'react';
import { ChromePicker } from "react-color"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import "./Users.css"
import { useEffect } from 'react';

const Setting = props => {
    const [value, setValue] = useState(props.value)
    const [open, setOpen] = useState(false)
    
    const changeHandler = v => {
        props.onChange(props.name, v)
    }

    useEffect(() => {
        setValue(props.value || props.default)
    }, [props])

    return (
        <div className={`setting ${props.type === "color" && "color-setting"} ${open && "open"}`}>
            {props.type === "color" ? 
                <>
                    <div className="color-header" onClick={() => setOpen(o => !o)}>
                        <h3>{props.name}</h3>
                        <div className="color-preview" style={{
                            background: value || "#000",
                        }}>

                        </div>
                    </div>
                    <ChromePicker
                        color={value}
                        onChange={color => changeHandler(color.hex)}
                        disableAlpha
                    />
                    <button onClick={() => changeHandler(props.default)}>reset</button>
                </>
                :
                <>
                    <FormControlLabel control={<Checkbox checked={value} onChange={e => changeHandler(e.target.checked)} name={props.name} />} label={props.name}/>
                </>
            }
        </div>
    );
}

export default Setting;
