import React, { useEffect } from "react";
import styled from "styled-components";
import logo from "../assets/images/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const LOGIN_URL = process.env.REACT_APP_LOGIN_URL;
	let token = localStorage.getItem("token");

	useEffect(() => {
		setTimeout(() => {
			token && navigate("/authentication/redirect");
		}, 0);
	}, [token]);

	return (
		<LoginWrapper>
			<img src={logo} alt="travelopod" />
			<h1>Travelopod-Chat</h1>
			<a href={LOGIN_URL}>
				<Button>Log In</Button>
			</a>
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

export const Button = styled.button`
	background-color: #21ba45;
	color: #fff;
	border: none;
	text-decoration: none;
	font-size: 1rem;
	cursor: pointer;
	padding: 0.78571429em 1.5em 0.78571429em;
	font-weight: 700;
	border-radius: 0.28571429rem;
`;
