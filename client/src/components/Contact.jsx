import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function Contact({listing}) {
	const [landlord, setLandlord] = useState(null);
	const [message, setMessage] = useState("");
	useEffect(() => {
		const fetchLandLord = async () => {
			try {
				const res = await fetch(`/api/user/${listing.userRef}`);
				const data = await res.json();
				setLandlord(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchLandLord();
	}, [listing.userRef]);
	function onChange(e) {
		setMessage(e.target.value);
	}
	return (
		<>
			{landlord && (
				<>
					<div className="flex flex-col gap-2">
						<p>
							Contact:{" "}
							<span className="font-semibold">{landlord.username}</span> for{" "}
							<span className="font-semibold">
								{listing.name.toLowerCase()}
							</span>
						</p>
						<textarea
							name="message"
							id="message"
							rows="2"
							value={message}
							className="w-full border p-3 rounded-lg"
							placeholder="Enter your message here"
							onChange={onChange}></textarea>
					</div>
					<Link
						className="bg-slate-700 py-2 text-white text-center uppercase rounded-lg hover:opacity-95"
						to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>
						Send Message
					</Link>
				</>
			)}
		</>
	);
}

export default Contact;
