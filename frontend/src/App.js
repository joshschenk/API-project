import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import { Route } from "react-router-dom"

import Spot from "./components/Spot";
import SpotDetails from "./components/SpotDetails"
import ListSpots from "./components/ListSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path="/" component={ListSpots}/>
        <Route exact path="/spots/:spotId" component={SpotDetails}/>
         </Switch>}

    </>
  );
}

export default App;
