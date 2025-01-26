import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

import { getPostsBySearch } from '../../actions/posts'; // Assuming you have an action for fetching tag suggestions
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const classes = useStyles();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]); // State for tag suggestions
  const history = useHistory();

  const debounce = useCallback((func, time) => {
    let timeoutId = null;
    return function (arg) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(arg);
        timeoutId = null;
      }, time);
    };
  }, []);

  const fetchTagSuggestions = async (tag) => {
    try {
      const response = await fetch('https://memories-backend-rupf.onrender.com/posts/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputSearch: tag })
      });

      const data = await response.json();
      setTagSuggestions(data.tags);

    } catch (error) {
      console.error('Error fetching tag suggestions:', error);
    }
  };

  const debouncedFetchData = useCallback(
    debounce((value) => {
       console.log(`debounce called ${value}`);

      fetchTagSuggestions(value);
    }, 500),
    [debounce]
  );

  const searchPost = () => {
    if (search.trim() || tags.length > 0) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleInputChange = (e) => {
    debouncedFetchData(e.target.value);
  };

  const handleAddChip = (tag) => setTags([...tags, tag]);

  const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

  const handleSuggestionClick = (suggestion) => {
    console.log(suggestion)
   handleAddChip(suggestion)
   setTagSuggestions([]);

  };

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
             <TextField
              onKeyDown={handleKeyPress}
              name="search"
              variant="outlined"
              label="Search Memories"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: '10px' }}
              />

              <ChipInput
                style={{ marginBottom: '10px' }}
                value={tags}
                onAdd={handleAddChip}
                onDelete={handleDeleteChip}
                label="Search Tags"
                variant="outlined"
                onKeyUp={(e) => handleInputChange(e)}
              />
              {tagSuggestions && tagSuggestions.length > 0 && (
                <Paper className={classes.suggestionsContainer} elevation={3}>
                  <List component="nav" aria-label="tag suggestions">
                    {tagSuggestions.map((suggestion, index) => (
                      <React.Fragment key={index}>
                        <ListItem button onClick={() => handleSuggestionClick(suggestion)}>
                          <ListItemText primary={suggestion} />
                        </ListItem>
                        {index !== tagSuggestions.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}
              <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {(!searchQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
