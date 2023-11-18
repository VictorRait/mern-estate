import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {app} from "../firebase";
function UpdateListing() {
	const {currentUser} = useSelector((state) => state.user);
	const [files, setFiles] = useState([]);
	const [imageUploadError, setImageUploadError] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		imageUrls: [],
		name: "",
		address: "",
		type: "rent",
		bathrooms: 1,
		bedrooms: 1,
		regularPrice: "",
		discountPrice: "",
		offer: false,
		parking: false,
		furnished: false,
	});

	const navigate = useNavigate();
	const params = useParams();
	useEffect(
		function () {
			const fetchListing = async () => {
				const listingId = params.listingId;
				const res = await fetch(`/api/listing/getListing/${listingId}`);
				const data = await res.json();
				console.log(data);
				setFormData(data);
				if (data.success === false) {
					console.log(data.message);
					return;
				}
			};
			fetchListing();
		},
		[params]
	);

	function handleImageSubmit() {
		if (files?.length > 0 && files.length < 7 + formData.imageUrls.length < 7) {
			setUploading(true);
			setImageUploadError(false);
			const promises = [];

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						imageUrls: formData.imageUrls.concat(urls),
					});
					setImageUploadError(false);
					setUploading(false);
				})
				.catch(() => {
					setImageUploadError("Image upload failed (2mb max per image)");
					setUploading(false);
				});
		} else {
			setImageUploadError("You can only upload 6 images per listing");
			setUploading(false);
		}
	}
	async function storeImage(file) {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(`Upload is ${progress}% done`);
				},
				(error) => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
						resolve(downloadURL)
					);
				}
			);
		});
	}
	function handleRemoveImage(index) {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((_, i) => i !== index),
		});
	}
	function handleChange(e) {
		if (e.target.id === "sale" || e.target.id === "rent") {
			setFormData({
				...formData,
				type: e.target.id,
			});
		}
		if (
			e.target.id === "parking" ||
			e.target.id === "furnished" ||
			e.target.id === "offer"
		) {
			setFormData({
				...formData,
				[e.target.id]: e.target.checked,
			});
		}
		if (
			e.target.type === "number" ||
			e.target.type === "text" ||
			e.target.type === "textarea"
		) {
			setFormData({
				...formData,
				[e.target.id]:
					e.target.type === "number" ? Number(e.target.value) : e.target.value,
			});
		}
	}
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			if (formData.imageUrls.length < 1)
				return setError("You must upload at least 1 image");
			if (formData.regularPrice < formData.discountPrice)
				return setError("Discount price must be less than regular price");
			setError(false);
			setLoading(true);
			const res = await fetch(`/api/listing/update/${params.listingId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
				}),
			});
			const data = await res.json();
			console.log(data);
			setLoading(false);
			if (data.success === false) {
				setError(data.message);
				return;
			}

			navigate(`/profile`);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	}

	return (
		<main className="p-3 max-w-4xl mx-auto ">
			<h1 className="text-3xl font-semibold text-center my-7">
				Update a Listing
			</h1>
			<form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-4 flex-1">
					<input
						id="name"
						maxLength="62"
						minLength="3"
						required
						type="text"
						placeholder="name"
						className="border p-3 rounded-lg"
						onChange={handleChange}
						value={formData.name}
					/>
					<textarea
						id="description"
						required
						type="text"
						placeholder="description"
						className="border p-3 rounded-lg"
						onChange={handleChange}
						value={formData.description}
					/>
					<input
						id="address"
						required
						type="text"
						placeholder="address"
						className="border p-3 rounded-lg"
						onChange={handleChange}
						value={formData.address}
					/>
					<div className="flex gap-6 flex-wrap">
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="sale"
								className="w-5"
								onChange={handleChange}
								checked={formData.type === "sale"}
							/>
							<label>Sell</label>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="rent"
								className="w-5"
								onChange={handleChange}
								checked={formData.type === "rent"}
							/>
							<label>Rent</label>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="parking"
								className="w-5"
								onChange={handleChange}
								checked={formData.parking}
							/>
							<label>Parking spot</label>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="furnished"
								className="w-5"
								onChange={handleChange}
								checked={formData.furnished}
							/>
							<label>Furnished</label>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								id="offer"
								className="w-5"
								onChange={handleChange}
								checked={formData.offer}
							/>
							<label>Offer</label>
						</div>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className="flex items-enter gap-2">
							<input
								onChange={handleChange}
								value={formData.bedrooms || ""}
								type="number"
								id="bedrooms"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<label htmlFor="bedrooms">Beds</label>
						</div>
						<div className="flex items-enter gap-2">
							<input
								onChange={handleChange}
								value={formData.bathrooms || ""}
								type="number"
								id="bathrooms"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<label htmlFor="bedrooms">Bathrooms</label>
						</div>
						<div className="flex items-enter gap-2">
							<input
								onChange={handleChange}
								value={formData.regularPrice || ""}
								type="number"
								id="regularPrice"
								placeholder="0"
								min="50"
								max="10000000"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<label htmlFor="bedrooms" className="flex flex-col items-center">
								<p>Regular Price</p>
								<span className="text-xs">($ / month)</span>
							</label>
						</div>
					</div>
					{formData.offer && (
						<div className="flex items-enter gap-2">
							<input
								onChange={handleChange}
								value={formData.discountPrice || 0}
								type="number"
								id="discountPrice"
								placeholder="0"
								min="0"
								max="10000000"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<label htmlFor="bedrooms" className="flex flex-col items-center">
								<p>Discounted Price</p>
								<span className="text-xs">($ / month)</span>
							</label>
						</div>
					)}
				</div>
				<div className="flex flex-col flex-1 gap-4">
					<p className="font-semibold">
						Images:{" "}
						<span className="font-normal text-gray-600 ml-2">
							The first image will be the cover (max 6)
						</span>
					</p>
					<div className="flex gap-4">
						<input
							onChange={(e) => setFiles(e.target.files)}
							className="p-3 border border-gray-300 rounded w-full"
							type="file"
							id="images"
							accept="image/*"
							multiple
						/>

						<button
							type="button"
							disabled={uploading}
							onClick={handleImageSubmit}
							className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
							{uploading ? "Uploading..." : "Upload"}
						</button>
					</div>
					<p className="text-red-700">{imageUploadError && imageUploadError}</p>
					{formData?.imageUrls?.length > 0 &&
						formData.imageUrls.map((url, index) => (
							<div
								key={index}
								className="flex justify-between p-3 border items-center">
								<img
									src={url}
									alt="listing image"
									className="w-20 h-20 object-contain rounded-lg"
								/>
								<button
									type="button"
									onClick={() => handleRemoveImage(index)}
									className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">
									Delete
								</button>
							</div>
						))}
					<button
						disabled={loading || uploading}
						className="uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80">
						{loading ? "Updating..." : "Update Listing"}
					</button>
					{error && <p className="text-red-700">{error}</p>}
				</div>
			</form>
		</main>
	);
}

export default UpdateListing;
