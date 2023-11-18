import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
	try {
		const listing = await Listing.create(req.body);
		// Save the listing using the instance method, not the class method
		await listing.save();
		return res.status(201).json(listing);
	} catch (error) {
		next(error);
	}
};
