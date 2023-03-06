import React from "react";
import styled from "styled-components";

function GoogleSignInButton({ clientId }) {
	return (
		<a href="http://localhost:3040/authentication/start">
			<Button>Log In</Button>
		</a>
	);
}

export default GoogleSignInButton;

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
