import React, {useState} from 'react';
import { ChromePicker } from "react-color"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import "./Users.css"

const Setting = props => {
    const [value, setValue] = useState(props.value)
    const [open, setOpen] = useState(false)
    
    const changeHandler = v => {
        setValue(v)
        props.onChange(props.name, v)
    }

    return (
        <div className={`setting ${props.type === "color" && "color-setting"} ${open && "open"}`} onClick={() => setOpen(o => !o)}>
            {props.type === "color" ? 
                <>
                    <h3 className="color-header">{props.name}</h3>
                    <ChromePicker
                        color={value}
                        onChange={color => changeHandler(color.hex)}
                        disableAlpha
                    />
                    <button onClick={() => changeHandler("")}>reset</button>
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
