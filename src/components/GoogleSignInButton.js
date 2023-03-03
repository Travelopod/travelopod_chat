import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function GoogleSignInButton({ clientId }) {
	const { updateUser } = useContext(UserContext);
	const navigate = useNavigate();
	useEffect(() => {
		window.gapi.load("auth2", () => {
			window.gapi.auth2.init({
				// old one
				client_id:
					"1001822469952-ifcjetnuktj8q9unhvomk6o5hi8lu0ha.apps.googleusercontent.com",
				// new one
				// client_id:
				// 	"1001822469952-nlh1v2vm9v7pnl78tobm78lior6c092h.apps.googleusercontent.com",
				scope: "email profile openid",
				header: {
					"Referrer-Policy": "no-referrer-when-downgrade",
				},
			});
		});
	}, [clientId]);

	function handleGoogleSignIn() {
		const auth2 = window.gapi.auth2.getAuthInstance();
		auth2
			.signIn()
			.then(googleUser => {
				// handle successful sign-in
				const id_token = googleUser.getAuthResponse().id_token;
				// .isSignedIn()
				// getBasicProfile()
				if (googleUser.isSignedIn()) {
					updateUser(googleUser);
					localStorage.setItem(
						"user",
						JSON.stringify({
							...googleUser.getBasicProfile(),
							...{ isSignedIn: true },
						})
					);
					navigate("/chat");
				}

				// send id_token to server for validation
			})
			.catch(err => {
				// handle sign-in error
			});
	}

	return (
		<Button>
			<a href="http://localhost:3040/authentication/start">Log In</a>
		</Button>
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
