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
function Profile() {
	const {currentUser} = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePercentage, setFilePercentage] = useState(0);
	const [fileUploadErr, setFileUploadErr] = useState(false);
	const [formData, setFormData] = useState({});
	const [previousFile, setPreviousFile] = useState(undefined);
	console.log(file);
	console.log(formData.avatar);
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
	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form className="flex flex-col gap-4">
				<img
					onClick={() => fileRef.current.click()}
					src={formData.avatar || currentUser.avatar}
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
					type="text"
					placeholder="username"
					className="border p-3 rounded-lg"
				/>
				<input
					id="email"
					type="email"
					placeholder="email"
					className="border p-3 rounded-lg"
				/>
				<input
					id="password"
					type="password"
					placeholder="password"
					className="border p-3 rounded-lg"
				/>
				<button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
					Update
				</button>
			</form>
			<div className="flex justify-between mt-5">
				<span className="text-red-700 cursor-pointer">Delete Account</span>
				<span className="text-red-700 cursor-pointer">Sign out</span>
			</div>
		</div>
	);
}

export default Profile;
