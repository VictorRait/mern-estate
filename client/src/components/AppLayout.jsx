import {Outlet, Navigate, useLocation} from "react-router-dom";
import Header from "./Header";

function AppLayout() {
	const location = useLocation();

	// Conditionally render Navigate only for the root path ('/')
	const isRootPath = location.pathname === "/";
	const navigateToHome = isRootPath ? <Navigate to="/home" /> : null;

	return (
		<div>
			<Header />
			<main>
				{navigateToHome}
				<Outlet />
			</main>
		</div>
	);
}

export default AppLayout;
