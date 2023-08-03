import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';

const IPAddress =(props)=>{
    const {label, getValue, id, disabled, value, deleteItem, required, errMsg} = props;
    const [validIP, setIP] = useState(false);
    const [fieldData, setFieldData] = useState('');

    const ipv4 = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    const ipv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;

    useEffect(() => {
        setFieldData(value)
    }, [value]);

    const handleChange=(e)=>{
        setFieldData(e.target.value);
    }
    const handleBlur =(e)=>{
        const {value} = e.target;
        if(value.trim().length > 0){
            if(ipv4.test(value)){
                setIP(false);
                getValue(id, value);
            }
            else if(ipv6.test(value)){
                setIP(false);
                getValue(id, value);
            }
            else{
                setIP(true);
                getValue(id, value);
            }
        }
        else{
            setIP(false);
            getValue(id, value);
        }
    }

    const deleteField =(id)=>{
        deleteItem(id);
        setIP(false);
    }

    return(
        <>
            <TextField
                id={`text${id}`}
                label={Boolean(label) ? label : "Enter IP Address"}
                variant="outlined"
                className="IPTextField"
                onChange={(e)=>handleChange(e)}
                onBlur={handleBlur}
                disabled={Boolean(disabled) ? disabled : false}
                error={fieldData != "" ? validIP : false}
                helperText={fieldData != "" ?  Boolean(validIP) && errMsg : null }
                value={fieldData || ''}
                required={required || true}
            />

            {id > 0
                ? <DeleteIcon
                        className='deleteField'
                        onClick={()=>deleteField(id)}
                        disabled={Boolean(disabled) ? disabled : false}
                    />
                : null
            }
        </>
    )
}

export default IPAddress;
