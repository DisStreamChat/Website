import { Route, Redirect } from "react-router-dom";
import firebase from "../../firebase";

const ProtectedRoute = ({ component: RouteComponent, ...rest }) => {
	return (
		<Route
			{...rest}
			render={routeProps =>
				firebase.auth.currentUser ? <RouteComponent {...routeProps} /> : <Redirect to="/" />
			}
		/>
	);
};

export default ProtectedRoute;
