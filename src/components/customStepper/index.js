import React from "react";
import { makeStyles } from "@material-ui/core";
import "./styles.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const getColor = (id) => {
  let color = "#68BAF0";
  switch (id) {
    case 100:
      color = "#D3E6FB";
      break;
    case 5:
      color = "#F7B500";
      break;
    case 15:
      color = "#68BAF0";
      break;
    case 4:
      color = "#68BAF0";
      break;
    case 1:
      color = "#264D88";
      break;
    case 9:
      color = "#FF9B7C";
      break;
    case 8:
      color = "#FF9B7C";
      break;
    case 14:
      color = "#FF9B7C";
      break;
    case 3:
      color = "#F7B500";
      break;
    case 2:
      color = "#F7B500";
      break;
    default:
      color = "#68BAF0";
  }

  return color;
};

const CustomStepper = (props) => {
  const classes = useStyles();
  const data = props.dataprops;

  return (
    <div className={classes.root} id="stepper">
      <div className="stepperWrap">
        <div className="stepper">
          <ul>
            {data.map((status, index) => {
              return (
                <li key={index}>
                  <h4> {status.emailStatus}</h4>
                  <h4 className="fontSize">
                    {" "}
                    {status?.emailNumber
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}{" "}
                  </h4>
                  <div
                    className="color-stepper"
                    style={{ background: `${getColor(status.id)}` }}
                  >
                    {" "}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomStepper;
