import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* <Route
					path="/"
					element={
						<>
							<h2>HomePage</h2>
							<Link to="/chat">Go to Chat Page</Link>
						</>
					}
				/> */}
				<Route path="/authentication/redirect" element={<Home />} />

				<Route exact path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
