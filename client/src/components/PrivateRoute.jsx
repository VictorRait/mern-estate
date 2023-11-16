import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

function PrivateRoute() {
	const user = useSelector((state) => state.user);
	console.log(user.currentUser);
	return user.currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
