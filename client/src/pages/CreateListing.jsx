import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import {useState} from "react";
import {app} from "../firebase";
function CreateListing() {
	const [files, setFiles] = useState([]);
	const [imageUploadError, setImageUploadError] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [formData, setFormData] = useState({
		imageUrls: [],
	});

	console.log(files.length < 7);
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
	return (
		<main className="p-3 max-w-4xl mx-auto ">
			<h1 className="text-3xl font-semibold text-center my-7">
				Create a Listing
			</h1>
			<form className="flex flex-col sm:flex-row gap-4">
				<div className="flex flex-col gap-4 flex-1">
					<input
						id="name"
						maxLength="62"
						minLength="10"
						required
						type="text"
						placeholder="name"
						className="border p-3 rounded-lg"
					/>
					<textarea
						id="description"
						required
						type="text"
						placeholder="description"
						className="border p-3 rounded-lg"
					/>
					<input
						id="address"
						required
						type="text"
						placeholder="address"
						className="border p-3 rounded-lg"
					/>
					<div className="flex gap-6 flex-wrap">
						<div className="flex gap-2">
							<input type="checkbox" id="sale" className="w-5" />
							<label>Sell</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="rent" className="w-5" />
							<label>Rend</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="parking" className="w-5" />
							<label>Parking spot</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="furnished" className="w-5" />
							<label>Furnished</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" id="offer" className="w-5" />
							<label>Offer</label>
						</div>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className="flex items-enter gap-2">
							<input
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
								type="number"
								id="regularPrice"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<label htmlFor="bedrooms" className="flex flex-col items-center">
								<p>Regular Price</p>
								<span className="text-xs">($ / month)</span>
							</label>
						</div>
						<div className="flex items-enter gap-2">
							<input
								type="number"
								id="discountedPrice"
								min="1"
								max="10"
								required
								className="p-3 border border-gray-300 rounded-lg"
							/>
							<label htmlFor="bedrooms" className="flex flex-col items-center">
								<p>Discounted Price</p>
								<span className="text-xs">($ / month)</span>
							</label>
						</div>
					</div>
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
					{formData.imageUrls.length > 0 &&
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
					<button className="uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80">
						Create Listing
					</button>
				</div>
			</form>
		</main>
	);
}

export default CreateListing;