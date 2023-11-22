import {BrowserRouter, Routes, Route} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import PrivateRoute from "./components/PrivateRoute";
import Search from "./pages/Search";
import About from "./pages/About";
import CreateListing from "./pages/CreateListing";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UpdateListing from "./pages/UpdateListing";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route index path="/home" element={<Home />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/about" element={<About />} />
					<Route path="/listing/:id" element={<Listing />} />
					<Route path="/search" element={<Search />} />
					<Route element={<PrivateRoute />}>
						<Route path="/profile" element={<Profile />} />
						<Route path="/create-listing" element={<CreateListing />} />
						<Route
							path="/update-listing/:listingId"
							element={<UpdateListing />}
						/>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
