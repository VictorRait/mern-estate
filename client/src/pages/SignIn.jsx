import {useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
function SignIn() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({});
	const {isLoading, error} = useSelector((state) => state.user);
	const dispatch = useDispatch();
	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	}
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			dispatch(signInStart());
			const res = await fetch("api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				console.log("false");
				dispatch(signInFailure(data.message));

				return;
			}
			console.log("true");
			dispatch(signInSuccess(data));
			navigate("/");

			console.log(data);
		} catch (error) {
			dispatch(signInFailure(error.message));
		}
	}
	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="email"
					className="border p-3 rounded-lg"
					id="email"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="password"
					className="border p-3 rounded-lg"
					id="password"
					onChange={handleChange}
				/>
				<button
					disabled={isLoading}
					className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
					{isLoading ? "Loading..." : "Sign In"}
				</button>
				<OAuth />
			</form>
			<div className="flex gap-2 mt-5">
				<p>{"Don't have an account?"}</p>
				<Link to={"/sign-up"}>
					<span className="text-blue-700">Sign up</span>
				</Link>
			</div>

			{error && <p className="text-red-500 mt-5">{error}</p>}
		</div>
	);
}

export default SignIn;
