import { Box, ChakraProvider, Grid } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './conponents/HomePage';
import Sidebar from './conponents/Sidebar';
import TestParametersPage from './conponents/TestParametersPage';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Grid templateColumns="400px 1fr" height="100%">
          <Box padding={10}>
            <Sidebar></Sidebar>
          </Box>
          <Box padding={10}>
            <Switch>
              <Route path="/test-parameters">
                <TestParametersPage></TestParametersPage>
              </Route>
              <Route path="/">
                <HomePage></HomePage>
              </Route>
            </Switch>
          </Box>
        </Grid>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
