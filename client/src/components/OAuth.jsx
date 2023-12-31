import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {app} from "../firebase";
import {
	signInFailure,
	signInStart,
	signInSuccess,
} from "../redux/user/userSlice";
function OAuth() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	async function handleGoogleClick() {
		try {
			dispatch(signInStart());
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);

			const result = await signInWithPopup(auth, provider);
			const res = await fetch("/api/auth/google", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: result.user.displayName,
					email: result.user.email,
					photo: result.user.photoURL,
				}),
			});

			const data = await res.json();
			if (data.success === false) {
				dispatch(signInFailure(data.message));
				return;
			}
			dispatch(signInSuccess(data));
			navigate("/home");
		} catch (error) {
			dispatch(signInFailure(error.message));
			console.log("Could not sign in with google", error);
		}
	}
	return (
		<button
			onClick={handleGoogleClick}
			type="button"
			className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
			Continue with google
		</button>
	);
}

export default OAuth;
