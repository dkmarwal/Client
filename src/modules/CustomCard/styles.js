export const styles = theme => ({
  cardContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      backgroundColor: '#fff',
      height: '10rem',
  },
  itemWrapper : {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
      flexWrap: 'nowrap',
  },
  content: {
      color: theme.palette.primary.main,
      fontSize: "2rem",
      textTransform: 'uppercase',
  },
});