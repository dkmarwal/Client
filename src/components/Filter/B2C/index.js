import React from "react";
import { Box, makeStyles, Chip } from "@material-ui/core";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { withTranslation } from 'react-i18next';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";

import "./styles.scss";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  wrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  item: {
    background: "#E4E4E4",
    border: "none",
    padding: "0 5px",
  },
  itemSelected: {
    background: "#0B1941",
    padding: "0 5px",
    color: "#fff",
    fontWeight: 300,
  },
  slider: {
    width: "100%",
    display: "block",
    marginTop: 4,
  },
  slide: {
    width: "auto !important",
    display: "flex",
    justifyContent: "flex-start",
    margin: "0 7px !important",
  },
  btn: {
    border: "none",
    margin: "4px",
    backgroundColor: "#ffffff",
  },
}));

const ChipFilter = (props) => {
  const classes = useStyles();

  const { handleClickFilter, list, selectedFilterItem, isListLoading = false, t } = props;

  const listItems =
    list.length &&
    list.map((item, index) => {
      return (
        <Slide index={index} className={classes.slide} style={{ width: "25%" }}>
          <Chip
            key={index}
            label={item.count === null ? `${item.roleName}` :
              `${item.roleName} (${item.count === null ? 0 : (item.count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})`}
            size="medium"
            className={
              selectedFilterItem.roleName == item.roleName
                ? classes.itemSelected
                : classes.item
            }
            variant={
              selectedFilterItem.roleName == item.roleName
                ? "default"
                : "outlined"
            }
            color="primary"
			style={{pointerEvents:isListLoading? 'none':'auto' }}
            onClick={(event) => {handleClickFilter(event, item, index) }}
          />
        </Slide>
      );
    });

  const listCount = list && list.length > 62 ? (list.length - 61) :list.length > 60 ? (list.length - 58) : list.length > 53 ? (list.length - 52) : list.length > 43 ? (list.length - 42) : list.length > 40 ? (list.length - 39) : (list.length > 20) ? list.length - 19 : (list.length > 15) ? list.length - 13 : (list.length > 10) ? list.length - 9 : (list.length > 9) ? list.length - 6 : (list.length > 5) ? list.length - 4 : (list.length - 0);

  return (
    <Box className={classes.root}>
      {list.length > 0 && (
        <CarouselProvider
          naturalSlideHeight={35}
          naturalSlideWidth={250}
          visibleSlides={listCount}
          totalSlides={list.length}
          isIntrinsicHeight={true}
          isIntrinsicWidth={true}
          className={classes.wrapper}
        >
          <ButtonBack className={classes.btn}>
            <ChevronLeftIcon />
          </ButtonBack>
          <Slider className={classes.slider}>{listItems}</Slider>
          <ButtonNext size="medium" className={classes.btn}>
            <ChevronRightIcon />
          </ButtonNext>
        </CarouselProvider>
      )}
    </Box>
  );
}

export default withTranslation()(ChipFilter);
