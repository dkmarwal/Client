import React from "react";
import "./styles.scss";
import { Card, Grid, Box, Typography } from "@material-ui/core";
import { withTranslation } from "react-i18next";

class StackBar extends React.Component {
  state = {
    // totalCount: this.props.data.reduce((total, item) => total + item.count,0)
  };

  render() {
    const { heading, data, otherReasons } = this.props;
    const  totalCount  = data?.length> 0 ? data.reduce((total, item) => total + item.count,0) : 0;
    return (
      <Card
        className="cardWrap"
        elevation={0}
        style={{ 
          // maxHeight: this.props.i18n.language === "fr" ? 148 : 132, 
          width: '100%' }}
      >
        <div className="_content">
          <Box
            display="flex"
            justifyContent="left"
            color={"#4c4c4c"}
            fontWeight="700"
          >
            <Typography variant="span">{heading}</Typography>
          </Box>
          {totalCount && totalCount > 0
            ? data.map((obj, i) => (
                <span className="tooltip">
                  <span
                    className={"chip"}
                    style={{
                      width: `${(obj.count / totalCount) * 100}%`,
                      background: obj.color,
                    }}
                  />
                  {obj.label=="Others" ?
                  <span
                    // class={
                    //   i === data.length - 1
                    //     ? "showLeft tooltiptext"
                    //     : "tooltiptext"
                    // }
                    class="showLeft tooltiptext toolTipWidth"
                  >
                    {otherReasons?.length > 0 && otherReasons.map(item => 
                      <div>{item.label}: {item.count}</div>
                    )}
                  </span>
                  :<span
                    class={
                      i === data.length - 1
                        ? "showLeft tooltiptext"
                        : "tooltiptext"
                    }
                  >
                    {obj.label}
                  </span>
                  }
                </span>
              ))
            :
              <span>
                <span
                  className={"chip"}
                  style={{
                    width: "100%",
                    background: "#F4F4F4",
                  }}
                />
              </span>
            }
          <div className="keyPoints">
            <Grid
              container
              justify={
                this.props.i18n.language === "fr" ? "space-between" : null
              }
            >
              {totalCount && totalCount > 0 ? data.map((obj) => (
                <Grid item xs={4}>
                <Box mb={1}>
                  <span className="infoGroup">
                    <span className="info">
                    <Grid container>
                      <Grid item xs={1}>
                      <span
                      className="squareBox"
                      style={{ background: obj.color }}
                    ></span>

                      </Grid>
                      <Grid item xs={5}>
                      <span className="text">
                        {obj.label}
                      </span>
                      </Grid>
                      <Grid item xs={5}>
                      <span className="percentage">
                        {obj.count.toString() && totalCount && totalCount > 0
                          ? `${obj.count
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${(
                              (obj.count / totalCount) *
                              100
                            ).toFixed(2)}%)`
                          : 0}
                      </span>
                      </Grid>
                    </Grid>
                    </span>
                  </span>
                </Box>
                </Grid>
              ))
              :
              <Box my={1}>
                <span className="infoGroup">
                  <span className="info">
                    <span className="text">
                      No Data to Show
                    </span>
                  </span>
                </span>
              </Box>
              }
            </Grid>
          </div>
        </div>
      </Card>
    );
  }
}

export default withTranslation()(StackBar);
