import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

import { Route } from "react-router-dom"

import Spot from "./components/Spot";
import SpotDetails from "./components/SpotDetails";
import ListSpots from "./components/ListSpots";
import CreateSpot from "./components/CreateSpot";
import CurrentSpots from "./components/CurrentSpots";
import EditSpot from "./components/EditSpot";
import DeleteModal from "./components/DeleteModal"

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
        <Route exact path="/spots/new" component={CreateSpot}/>
        <Route exact path="/" component={ListSpots}/>
        <Route exact path="/spots/current" component={CurrentSpots} />
        <Route exact path="/spots/:spotId/edit" component={EditSpot}/>
        <Route exact path="/spots/:spotId" component={SpotDetails}/>
        <Route exact path="/delete" component={DeleteModal}/>
         </Switch>}

    </>
  );
}

export default App;
