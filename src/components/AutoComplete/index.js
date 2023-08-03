import React from "react";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
}));

export default function Tags(props) {
  const classes = useStyles();
  const {
    label,
    name,
    value,
    onHandleChange,
    isError,
    helperText,
    parentIndex,
    childIndex,
  } = props;

  const onChange = (e, values) => {
    onHandleChange(values, parentIndex, childIndex);
  };
  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={[]}
        freeSolo
        disabled
        onChange={onChange}
        value={value}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              size="small"
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            name={name}
            label={label}
            InputLabelProps={{ shrink: true }}
            error={isError}
            helperText={helperText}
          />
        )}
      />
    </div>
  );
}
