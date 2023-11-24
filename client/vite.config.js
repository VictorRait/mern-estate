import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: `http://localhost:${import.meta.env.PORT}`,
				secure: true,
			},
		},
	},
	plugins: [react()],
});
