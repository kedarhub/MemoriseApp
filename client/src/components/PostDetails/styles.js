import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({

  card: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
  },
  imageSection: {
  display: 'flex',
  justifyContent: 'center', // Center align the image horizontally
  alignItems: 'center', // Center align the image vertically
  width: '50%', // Set the width of the image section
  maxHeight: '400px', // Set the maximum height of the image
  overflow: 'hidden', // Hide any overflow to maintain aspect ratio
},
media: {
  width: '100%', // Ensure the image takes up the full width of its container
  height: 'auto', // Automatically adjust the height to maintain aspect ratio
},

  recommendedPosts: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '15px',
    height: '39vh',
  },
  commentsOuterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commentsInnerContainer: {
    height: '200px',
    overflowY: 'auto',
    marginRight: '30px',
  },
  commentContainer: {
    borderLeft: `2px solid ${theme.palette.secondary.main}`,
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(1),
    background: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
  },
  nestedComments: {
    paddingLeft: theme.spacing(2),
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  replyContainer: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  replyButton: {
    marginRight: theme.spacing(1),
  },
}));
