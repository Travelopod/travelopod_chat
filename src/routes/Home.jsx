import React, { useEffect, useState } from "react";
import MessageWindow from "../components/MessageWindow";
import SearchBar from "../components/SearchBar";
import styled from "styled-components";
import "./style.css";
import { useNavigate } from "react-router-dom";
const AUTH_URL = process.env.REACT_APP_AUTH_URL;

export default function Home() {
	const [openChatMessages, setOpenChatMessages] = useState(null);
	const [contactMessageInfo, setContactMessageInfo] = useState([]);
	const [email, setEmail] = useState("");
	const [agent, setAgent] = useState({});
	const navigate = useNavigate();

	const props = {
		openChatMessages,
		contactMessageInfo,
		setOpenChatMessages,
		setContactMessageInfo,
		agent,
	};

	useEffect(() => {
		if (localStorage.getItem("agent")) {
			setAgent(JSON.parse(localStorage.getItem("agent")));
		}

		async function fetchData() {
			try {
				const token = await fetchToken(window.location.search);
				const userResponse = await fetch(
					`${process.env.REACT_APP_AUTH_URL}/users/me`,
					{
						headers: {
							Authorization: `bearer ${token.access}`,
						},
					}
				);
				token && localStorage.setItem("token", token.access);
				const userData = await userResponse.json();
				setEmail(userData.data.email);
				// TODO: remove this userName when using email
				localStorage.setItem(
					"userName",
					userData.data.firstName + " " + userData.data.lastName
				);
				const agentResponse = await fetch(
					"https://api.interakt.ai/v1/organizations/org-channel-agents/",
					{
						headers: {
							Authorization: `Token ${process.env.REACT_APP_INTERAKT_API_TOKEN}`,
						},
					}
				);
				const agentData = await agentResponse.json();
				// TODO: use email (state)variable here instead
				const filteredAgent = agentData.data.agents.filter(
					user => user.email === "ankur.seth@travelopod.com"
				);
				// TODO: show error message if user not found in filteredAgent
				if (filteredAgent.length) {
					setAgent(filteredAgent[0]);
					localStorage.setItem("agent", JSON.stringify(filteredAgent[0]));
				}
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, []);

	let accessToken = localStorage.getItem("token");
	useEffect(() => {
		// waits for 1 second before redirecting to login page, if token not found.
		setTimeout(() => !accessToken && navigate("/login"), 1000);
	}, [accessToken]);

	return (
		<Wrapper>
			{Object.keys(agent).length ? (
				<>
					<SearchBar {...props} />
					<MessageWindow {...props} />
				</>
			) : (
				<div className="loader" />
			)}
		</Wrapper>
	);
}

export const Wrapper = styled.div`
	border-radius: 23px;
	background-color: white;
	padding: 2rem;
	height: 88vh;
	margin: 1.5rem;
	overflow: hidden;
`;

export async function fetchToken(search) {
	const response = await fetch(`${AUTH_URL}/authentication/token${search}`);
	if (response.status !== 200) {
		throw new Error("unauthorized");
	}
	return await response.json();
}
