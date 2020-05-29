import React, {useState, useEffect} from 'react';
import { ChromePicker } from "react-color"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Setting = props => {
    const [value, setValue] = useState(props.value)
    
    const changeHandler = v => {
        setValue(v)
        props.onChange(props.name, v)
    }

    return (
        <div>
            {props.type === "color" ? 
                <div className="color-picker">
                    <h3>{props.name}</h3>
                    <ChromePicker
                        color={value}
                        onChange={color => changeHandler(color.hex)}
                        disableAlpha
                    />
                    <button onClick={() => changeHandler("")}>reset</button>
                </div>
                
                :
                <>
                    <FormControlLabel control={<Checkbox checked={value} onChange={e => changeHandler(e.target.checked)} name={props.name} />} label={props.name}/>
                </>
            }
        </div>
    );
}

export default Setting;
