import {BrowserRouter, Routes, Route} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import About from "./pages/About";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route index path="/home" element={<Home />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/about" element={<About />} />
					<Route path="/profile" element={<Profile />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
