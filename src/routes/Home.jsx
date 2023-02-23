import React, { useState } from "react";
import MessageWindow from "../components/MessageWindow";
import SearchBar from "../components/SearchBar";
import styled from "styled-components";

export default function Home() {
	const [openChatMessages, setOpenChatMessages] = useState(null);
	const [contactMessageInfo, setContactMessageInfo] = useState([]);
	const props = {
		openChatMessages,
		contactMessageInfo,
		setOpenChatMessages,
		setContactMessageInfo,
	};
	return (
		<Wrapper>
			<SearchBar {...props} />
			<MessageWindow {...props} />
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
