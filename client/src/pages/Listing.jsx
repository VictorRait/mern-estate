import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import "swiper/css/bundle";
import {useSelector} from "react-redux";
import {
	FaBath,
	FaBed,
	FaChair,
	FaMapMarkerAlt,
	FaParking,
	FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
function Listing() {
	SwiperCore.use([Navigation]);
	const {currentUser} = useSelector((state) => state.user);
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [copied, setCopied] = useState(false);
	const [contact, setcontact] = useState(false);
	useEffect(
		function () {
			async function fetchListing() {
				try {
					setError(false);
					setLoading(true);
					const res = await fetch(`/api/listing/getListing/${params.id}`);
					const data = await res.json();
					if (data.success === false) {
						setError(data.message);
						setLoading(false);
						return;
					}
					setListing(data);
					setLoading(false);
				} catch (error) {
					setLoading(false);
					setError(error.message);
				}
			}
			fetchListing();
		},
		[params]
	);
	function handleContact() {
		setcontact(!contact);
	}
	return (
		<main>
			{loading && <p className="text-center my-7 text-2xl">Loading...</p>}
			{error && (
				<p className="text-center my-7 text-2xl">
					{"Something went wrong x_x"}
				</p>
			)}
			{listing && (
				<div>
					<Swiper navigation>
						{listing.imageUrls.map((url) => (
							<SwiperSlide key={url}>
								<div
									className="h-[550px]"
									style={{
										background: `url(${url}) center no-repeat`,
										backgroundSize: "cover",
									}}></div>
							</SwiperSlide>
						))}
					</Swiper>
					<div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
						<FaShare
							className="text-slate-500"
							onClick={() => {
								navigator.clipboard.writeText(window.location.href);
								setCopied(true);
								setTimeout(() => {
									setCopied(false);
								}, 2000);
							}}
						/>
					</div>
					{copied && (
						<p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
							Link copied!
						</p>
					)}
					<div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
						<p className="text-2xl font-semibold">
							{listing.name} - ${" "}
							{listing.offer ? (
								<>
									{" "}
									{listing.discountPrice.toLocaleString("en-US")}
									<span className="text-sm italic text-red-600"> OFF</span>
								</>
							) : (
								listing.regularPrice.toLocaleString("en-US")
							)}
							{listing.type === "rent" && " / month"}
						</p>
						<p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
							<FaMapMarkerAlt className="text-green-700" />
							{listing.address}
						</p>
						<div className="flex gap-4">
							<p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
								{listing.type === "rent" ? "For Rent" : "For Sale"}
							</p>
							{listing.offer && (
								<p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
									<span className="line-through text-gray-200">
										${listing.regularPrice.toLocaleString("en-US")}
									</span>{" "}
									$
									{(
										+listing.regularPrice - listing.discountPrice
									).toLocaleString("en-US")}
								</p>
							)}
						</div>
						<p className="text-slate-800">
							<span className="font-semibold text-black">Description - </span>
							{listing.description}
						</p>
						<ul className="text-green-900 font-semibold text-sm flex gap-4 sm:gap-6 flex-wrap ">
							<li className="flex items-center gap-1 whitespace-nowrap ">
								<FaBed className="text-lg" />
								{listing?.bedrooms}
								{listing?.bedrooms > 1 ? " bedrooms" : " bedroom"}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap ">
								<FaBath className="text-lg" />
								{listing?.bathrooms}
								{listing?.bathrooms > 1 ? " bathrooms" : " bathroom"}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap ">
								<FaParking className="text-lg" />
								{listing?.parkings}
								{listing?.parkings ? " Parking Spot" : " No Parking"}
							</li>
							<li className="flex items-center gap-1 whitespace-nowrap ">
								<FaChair className="text-lg" />
								{listing?.furnished}
								{listing?.furnished ? " Furnished" : " Unfurnished"}
							</li>
						</ul>
						{currentUser && listing.userRef !== currentUser._id && !contact && (
							<button
								onClick={handleContact}
								className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 py-2	">
								Contact Landlord
							</button>
						)}
						{contact && listing && <Contact listing={listing} />}
					</div>
				</div>
			)}
		</main>
	);
}

export default Listing;
