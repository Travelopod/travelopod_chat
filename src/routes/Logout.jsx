import React from "react";
import { useNavigate } from "react-router-dom";
// import { GoogleLogout } from "react-google-login";
// const CLIENT_ID =
// 	"351099967494-42co0qi845l7ojp51vfuj4nvffglfdln.apps.googleusercontent.com";
import styled from "styled-components";

export default function Logout() {
	const navigate = useNavigate();

	function handleGoogleSignOut() {
		alert("Are you sure you want to sign out?");
		localStorage.removeItem("agent");
		navigate("/login");
	}

	return (
		<div>
			<Button onClick={handleGoogleSignOut}>Logout</Button>
		</div>
	);
}

export const Button = styled.button`
	background-color: #fff;
	color: rgb(146, 170, 183);
	border: 1px solid rgb(146, 170, 183);
	text-decoration: none;
	font-size: 1rem;
	cursor: pointer;
	padding: 0.78571429em 1.5em 0.78571429em;
	font-weight: 700;
	border-radius: 0.28571429rem;
`;
