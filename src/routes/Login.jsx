import React, { useEffect } from "react";
import styled from "styled-components";
import logo from "../assets/images/logo.jpg";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useNavigate } from "react-router-dom";

const CLIENT_ID =
	"1001822469952-nlh1v2vm9v7pnl78tobm78lior6c092h.apps.googleusercontent.com";

export default function Login() {
	const navigate = useNavigate();
	let token = localStorage.getItem("token");

	useEffect(() => {
		token && navigate("/authentication/redirect");
	}, [token]);

	return (
		<LoginWrapper>
			<img src={logo} alt="travelopod" />
			<h1>Travelopod-Chat</h1>
			<GoogleSignInButton clientId={CLIENT_ID} />
		</LoginWrapper>
	);
}

export const LoginWrapper = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	background-color: #fff;
	button {
		background-color: #21ba45;
		color: #fff;
		text-shadow: none;
		background-image: none;
		font-size: 1rem;
	}
`;
