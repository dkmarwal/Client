import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Paper, Typography, Box, Grid } from "@material-ui/core";
import Button from "~/components/Forms/Button";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		width: "500px",
		padding: "30px 35px",
	},
	last: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		width: "300px",
		padding: "30px 35px",
	},
	value: {
		fontSize: "18px",
		letterSpacing: 0,
		lineHeight: "21px",
	},
	actionContainer: {
		marginTop: "1rem",
	},
}));

export default function Tooltip(props) {
	const {
		step,
		isLastStep,
		skipProps,
		primaryProps,
		tooltipProps,
	} = props;
	const classes = useStyles();

	return (
		<Paper
			className={clsx(isLastStep ? classes.last : classes.container)}
			{...tooltipProps}
		>
			<Box className={classes.info}>
				<Typography variant="body1" className={classes.value}>
					{step.content}
				</Typography>
			</Box>
			{!isLastStep ? (
				<Grid container spacing={2} justify="flex-end" className={classes.actionContainer}>
					<Grid item>
						<Button
							style={{
								fontSize: "14px",
							}}
							color="secondary"
							{...skipProps}
						>
							Skip The Tour
						</Button>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							style={{
								fontSize: "14px",
							}}
							color="primary"
							{...primaryProps}
						>
							Next
						</Button>
					</Grid>
				</Grid>
			) : (
				<Grid container spacing={2} justify="center" className={classes.actionContainer}>
					<Grid item>
						<Button
							variant="contained"
							style={{
								fontSize: "14px",
								margin: "2rem 0rem",
							}}
							color="primary"
							{...primaryProps}
						>
							Finish
						</Button>
					</Grid>
				</Grid>
			)}
		</Paper>
	);
}
