import { type NavigateFunction } from "react-router-dom";
// Define the type for the props that the HOC will inject
export interface WithRouterProps {
  navigate: NavigateFunction;
}

export interface WithRouterLocationProps {
  location: Location;
}