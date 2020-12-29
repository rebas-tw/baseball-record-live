import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import Record from '~~features/Record';

const routes = [
  {
    path: '/',
    component: Record,
    exact: true,
  },
  {
    path: '*',
    component: null,
    status: 404,
  },
];

const theme = extendTheme({
  colors: {
    primary: '#0A2C51',
    secondary: '#E8373D',
    confirm: {
      500: '#0A2C51',
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider resetCSS theme={theme}>
        <CSSReset />
        <Router>
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;

function RouteWithSubRoutes(route) {
  return <Route path={route.path} render={(props) => <route.component {...props} routes={route.routes} />} />;
}
