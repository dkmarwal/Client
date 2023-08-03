import React from 'react';
import {
  Box, makeStyles,
  Chip,
} from '@material-ui/core';

import Carousel, { slidesToShowPlugin, slidesToScrollPlugin } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: "10px",
    paddingRight: "10px",
    flexWrap: "wrap",
    width: "97%",
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  wrapper: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    width: "100%",
    "&::-webkit-scrollbar": {
      display: "none",
    }
  },
  item: {
    margin: "5px",
    border: "2px solid ",
    minWidth: "200px",
  }
}))

export default function ChipFilter(props) {
  const classes = useStyles();

  const { handleClickFilter, list, selectedFilterItem } = props;

  return (
    <Box className={classes.root}>
      <Box className={classes.wrapper} m={5}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexFlow: 'row', alignContent: 'center', textAlign: 'center' }}>
          <Carousel
            plugins={[
              'centered',
              'infinite',
              'arrows',
              {
                resolve: slidesToShowPlugin,
                options: {
                  numberOfSlides: 100,
                },
              },
              {
                resolve: slidesToScrollPlugin,
                options: {
                  numberOfSlides: 10,
                },
              },
            ]}
          >
            {
              list.length && list.map((item, index) => {
                return <Chip
                  key={index}
                  label={`${item.name} (${item.count})`}
                  className={classes.item}
                  size="medium"
                  variant={selectedFilterItem === index ? "default" : "outlined"}
                  color="primary"
                  onClick={() => handleClickFilter(item, index)}
                />
              })
            }
          </Carousel>
        </div>

      </Box>
    </Box>
  );
}
