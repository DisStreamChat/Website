import React from 'react';
import { Route, Redirect } from "react-router-dom"
import firebase from "../firebase"
import { useContext } from 'react';
import { AppContext } from '../contexts/Appcontext';

const ProtectedRoute = ({ component: RouteComponent, ...rest }) => {

    const {currentUser} = useContext(AppContext)

    return (
        <>
            <Route
                {...rest}
                render={routeProps =>
                    currentUser ? (
                        <RouteComponent {...routeProps} />
                    ) : (
                            <Redirect to="/" />
                        )
                }
            />
        </>
    );
}

export default ProtectedRoute;
