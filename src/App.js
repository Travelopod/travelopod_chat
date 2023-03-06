import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";

function App() {
	let token = localStorage.getItem("token");
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<Navigate to={token ? "/authentication/redirect" : "/login"} />
					}
				/>
				<Route path="/authentication/redirect" element={<Home />} />

				<Route exact path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
