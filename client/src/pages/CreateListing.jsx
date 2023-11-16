function CreateListing() {
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
							className="p-3 border border-gray-300 rounded w-full"
							type="file"
							id="images"
							accept="image/*"
							multiple
						/>
						<button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
							Upload
						</button>
					</div>
					<button className="uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80">
						Create Listing
					</button>
				</div>
			</form>
		</main>
	);
}

export default CreateListing;
