import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<>
							<h2>HomePage</h2>
							<Link to="/chat">Go to Chat Page</Link>
						</>
					}
				/>
				<Route path="/chat" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
