import React from "react";
import "./styles.scss";
import { Card, withStyles, Grid, Box } from "@material-ui/core";
import { withTranslation } from "react-i18next";

class StackBar extends React.Component {
  state = {
    data: [
      {
        color: "#002D72",
        label: "Approved",
        weight:
          this.props.weight && this.props.weight.approved
            ? this.props.weight.approved
            : 0,
      },
      {
        color: "#008CE6",
        label: "Pending Approval",
        weight:
          this.props.weight && this.props.weight.readyForApproval
            ? this.props.weight.readyForApproval
            : 0,
      },
      {
        color: "#CCE4FF",
        label: "Pending Payees",
        weight:
          this.props.weight && this.props.weight.pending
            ? this.props.weight.pending
            : 0,
      },
    ],
    totalWeight:
      this.props.weight && this.props.weight.totalCount
        ? this.props.weight.totalCount
        : 0,
  };

  render() {
    const { heading, t } = this.props;
    // let totalWeight = 0;
    // this.data.forEach(obj => {
    //     totalWeight = totalWeight + obj.weight;
    // });
    const { data, totalWeight } = this.state;
    return (
      <span className="_tileWrap">
        <Card className="cardWrap" style={{maxHeight: this.props.i18n.language === "fr" ? 148 : 124}}>
          <div className="_content">
            <div className={"heading"}>{heading}</div>
            {data.map((obj) => (
              <span className="tooltip">
                <span
                  className={"chip"}
                  style={{
                    width: `${(obj.weight / totalWeight) * 100}%`,
                    background: obj.color,
                  }}
                />
                <span class="tooltiptext">
                  {t(`componentData.CSC.${obj.label}`)}
                </span>
              </span>
            ))}
            <div className="keyPoints">
              <Grid
                container
                spacing={1}
                justify={
                  this.props.i18n.language === "fr" ? "space-between" : null
                }
              >
                {data.map((obj) => (
                  <Grid md={4}>
                    <Box my={1}>
                      <span>
                        <span className="infoGroup">
                          <span
                            className="squareBox"
                            style={{ background: obj.color }}
                          ></span>
                          <span className="info">
                            <span className="text">
                              {t(`componentData.CSC.${obj.label}`)}
                            </span>
                            <span className="percentage">
                              {obj.weight
                                ? `${obj.weight
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${(
                                    (obj.weight / totalWeight) *
                                    100
                                  ).toFixed(2)}%)`
                                : 0}
                            </span>
                          </span>
                        </span>
                      </span>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        </Card>
      </span>
    );
  }
}

export default withTranslation()(StackBar);
