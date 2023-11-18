import {useSelector} from "react-redux";
import {useRef} from "react";
import {useState} from "react";
import {useEffect} from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import {app} from "../firebase";
import {
	updateUserStart,
	updateUserFailure,
	updateUserSuccess,
	deleteUserFailure,
	deleteUserSuccess,
	deleteUserStart,
	signOutUserStart,
	signOutUserSuccess,
	signOutUserFailure,
} from "../redux/user/userSlice";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";

function Profile() {
	const dispatch = useDispatch();
	const {currentUser, loading, error} = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePercentage, setFilePercentage] = useState(0);
	const [fileUploadErr, setFileUploadErr] = useState(false);
	const [formData, setFormData] = useState({});
	const [previousFile, setPreviousFile] = useState(undefined);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [showListingsError, setShowListingsError] = useState(false);
	const [userListings, setUserListings] = useState([]);
	// fire base storage
	// allow read; allow write: if request.resource.size < 2 * 1024 * 1024 && request.resource.contentType.matches('image/.*')
	useEffect(() => {
		const handleFileUpload = (file) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setFilePercentage(Math.round(progress));
				},
				(error) => {
					console.error("Error uploading file:", error);
					setFileUploadErr(true);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						setFormData({...formData, avatar: downloadURL});
					});
				}
			);
		};

		// Check if the file has changed
		if (file && file !== previousFile) {
			// Clear previous file-related state if needed
			setFilePercentage(0);
			setFileUploadErr(false);

			// Call the file upload function
			handleFileUpload(file);

			// Update the previousFile to prevent repeated uploads
			setPreviousFile(file);
		}
	}, [
		file,
		setFilePercentage,
		setFileUploadErr,
		setFormData,
		formData,
		previousFile,
	]);

	function handleChange(e) {
		setFormData({...formData, [e.target.id]: e.target.value});
	}
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`api/user/update/${currentUser?._id}`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
			}
			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	}
	async function handleDeleteUser() {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure());
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	}
	async function handleSignout() {
		try {
			dispatch(signOutUserStart());
			const res = await fetch("/api/auth/signout");
			const data = await res.json();
			if (data.success === false) {
				dispatch(signOutUserFailure(data.message));
				return;
			}
			dispatch(signOutUserSuccess(data));
		} catch (error) {
			dispatch(signOutUserFailure(error.message));
		}
	}
	async function handleShowListings() {
		try {
			setShowListingsError(false);
			const res = await fetch(`/api/user/listings/${currentUser._id}`);
			const data = await res.json();
			if (data.success === false) {
				setShowListingsError(true);
				return;
			}

			setUserListings(data);
		} catch (error) {
			setShowListingsError(true);
		}
	}
	async function handleDeleteListing(listingId) {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return;
			}

			setUserListings((prev) =>
				prev.filter((listing) => listing._id !== listingId)
			);
		} catch (err) {
			console.log(err.message);
		}
	}
	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<img
					onClick={() => fileRef.current.click()}
					src={formData.avatar || currentUser?.avatar}
					alt=""
					className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
				/>
				<input
					onChange={(e) => setFile(e.target.files[0])}
					type="file"
					hidden
					ref={fileRef}
					accept="image/*"
				/>
				<p className="text-sm self-center">
					{fileUploadErr ? (
						<span className="text-red-700">
							{"Error image upload (Image must me less than 2 mb)"}
						</span>
					) : filePercentage > 0 && filePercentage < 100 ? (
						<span className="text-slate-700">Uploading {filePercentage}%</span>
					) : filePercentage === 100 ? (
						<span className="text-green-500">File successfully uploaded</span>
					) : (
						""
					)}
				</p>
				<input
					id="username"
					defaultValue={currentUser?.username}
					type="text"
					placeholder="username"
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					id="email"
					type="email"
					placeholder="email"
					defaultValue={currentUser?.email}
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					id="password"
					type="password"
					placeholder="password"
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
					{loading ? "Loading" : "Update"}
				</button>
				<Link
					to="/create-listing"
					className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95">
					Create Listing
				</Link>
			</form>
			<div className="flex justify-between mt-5">
				<span
					onClick={handleDeleteUser}
					className="text-red-700 cursor-pointer">
					Delete Account
				</span>
				<span onClick={handleSignout} className="text-red-700 cursor-pointer">
					Sign out
				</span>
			</div>
			<p className="text-red-700 mt-5">{error ? error : ""}</p>
			<p className="text-green-700 mt-5">
				{updateSuccess ? "User updated succesfully" : ""}
			</p>
			<button onClick={handleShowListings} className="text-green-700 w-full">
				Show Listings
			</button>
			<p className="text-red-700 mt-5">
				{showListingsError ? "There was a problem showing listings" : ""}
			</p>
			{userListings && userListings.length > 0 && (
				<div className="flex flex-col gap-4">
					<h1 className="text-center mt-7 text-2xl font-semibold">
						Your Listings
					</h1>
					{userListings.map((listing) => (
						<div
							key={listing._id}
							className="border rounded-lg p-3 flex justify-between items-center gap-4">
							<Link to={`/listing/${listing._id}`}>
								<img
									src={listing.imageUrls[0]}
									alt="listing cover"
									className="h-16 w-16 object-contain "
								/>
							</Link>
							<Link
								className="text-slate-700 font-semibold  hover:underline truncate flex-1"
								to={`/listing/${listing._id}`}>
								<p>{listing.name}</p>
							</Link>

							<div className="flex flex-col items-center">
								<button
									onClick={() => handleDeleteListing(listing._id)}
									className="text-red-700">
									Delete
								</button>
								<button className="text-green-700">Edit</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Profile;
