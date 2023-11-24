import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
function Home() {
	const [offerListings, setOfferListings] = useState([]);
	const [saleListings, setSaleListings] = useState([]);
	const [rentListings, setRentListings] = useState([]);
	SwiperCore.use([Navigation]);
	useEffect(() => {
		async function fetchOfferListings() {
			try {
				const res = await fetch("/api/listing/get?offer=true&limit=4");
				const data = await res.json();
				setOfferListings(data);
			} catch (error) {
				console.log(error);
			}
		}

		async function fetchRentListings() {
			try {
				const res = await fetch("/api/listing/get?type=rent&limit=4");
				const data = await res.json();
				setRentListings(data);
			} catch (error) {
				console.log(error);
			}
		}
		async function fetchSaleListings() {
			try {
				const res = await fetch("/api/listing/get?type=sale&limit=4");
				const data = await res.json();
				setSaleListings(data);
			} catch (error) {
				console.log(error);
			}
		}
		fetchOfferListings();
		fetchRentListings();
		fetchSaleListings();
	}, []);
	console.log(offerListings, rentListings, saleListings);
	return (
		<div>
			<div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
				<h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
					Find your next <span className="text-slate-500">perfect</span>
					<br /> place with ease
				</h1>
				<div className="text-gray-400 text-xs sm:text-sm">
					Sahand Estate is the best place to find your perfect place to live.
					<br />
					We have a wide range of properties for you to choose from.
				</div>
				<Link
					className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
					to="/search">
					Let's get started...
				</Link>
			</div>
			<Swiper navigation>
				{offerListings &&
					offerListings.length > 0 &&
					offerListings.map((listing) => (
						<SwiperSlide key={listing._id}>
							<div
								className="h-[500px]"
								key={listing._id}
								style={{
									background: `url(${listing.imageUrls[0]}) center no-repeat `,
									backgroundSize: "cover",
								}}></div>
						</SwiperSlide>
					))}
			</Swiper>
			<div className="max-w-6xl mx-auto p-3 flex flex-col my-10 gap-8">
				{offerListings && offerListings.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="text-2xl font-semibold text-slate-600 ">
								Recent offers
							</h2>
							<Link
								to="/search?offer=true"
								className="text-sm text-blue-700 hover:underline ">
								Show more offers
							</Link>

							<div className="flex gap-4 flex-wrap lg:flex-nowrap mt-4">
								{offerListings.map((listing, index) => (
									<ListingItem key={index} listing={listing} />
								))}
							</div>
						</div>
					</div>
				)}
				{rentListings && rentListings.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="text-2xl font-semibold text-slate-600 ">
								Recent place for rent
							</h2>
							<Link
								to="/search?type=rent"
								className="text-sm text-blue-700 hover:underline ">
								Show more places for rent
							</Link>

							<div className="flex gap-4 flex-wrap lg:flex-nowrap mt-4">
								{rentListings.map((listing, index) => (
									<ListingItem key={index} listing={listing} />
								))}
							</div>
						</div>
					</div>
				)}
				{saleListings && saleListings.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="text-2xl font-semibold text-slate-600 ">
								Recent places for sale
							</h2>
							<Link
								to="/search?type=sale"
								className="text-sm text-blue-700 hover:underline">
								Show more places for sale
							</Link>

							<div className="flex gap-4 flex-wrap lg:flex-nowrap mt-4">
								{saleListings.map((listing, index) => (
									<ListingItem key={index} listing={listing} />
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Home;
