import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import "swiper/css/bundle";
function Listing() {
	SwiperCore.use([Navigation]);
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
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

	return (
		<main>
			{loading && <p className="text-center my-7 text-2xl">Loading...</p>}
			{error && (
				<p className="text-center my-7 text-2xl">
					{"Something went wrong x_x"}
				</p>
			)}
			{listing && (
				<>
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
				</>
			)}
		</main>
	);
}

export default Listing;
