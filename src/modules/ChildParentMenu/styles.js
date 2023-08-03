export const styles = (theme) => ({
  root: {
    flexGrow: 1,
    color: theme.palette.text.secondary,
    "&:hover > $content": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:focus > $content, &$selected > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
      backgroundColor: "transparent",
    },
  },
  labelText: {
    display: "flex",
    alignItems: "flex-end",
    paddingLeft: "8px",
    fontSize: "16px",
    color: "#0B1941",
  },
  labelIcon: {
    fontSize: "18px",
  },
});
