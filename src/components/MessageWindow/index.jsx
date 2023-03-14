import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import EmojiPicker from "emoji-picker-react";
import sendIcon from "../../assets/icon/send-icon.svg";
import selectEmoji from "../../assets/icon/emoji-happy.svg";
import attachIcon from "../../assets/icon/attachment.svg";
import anonymousUser from "../../assets/icon/anonymousUser.svg";
import Logout from "../../routes/Logout";
import styled from "styled-components";

function MessageWindow({ openChatMessages, agent }) {
	// all the chat-messages for the specific customer
	const [chatDetails, setChatDetails] = useState([]);
	// storing values in input field
	const [inputValue, setInputValue] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	// to add focus to input field while adding emojis
	const inputRef = useRef(null);
	const messageWindowRef = useRef(null);

	const [showLoader, setLoader] = React.useState(true);
	const [sendingLoader, setSendingLoader] = React.useState(false);

	const id = openChatMessages ? openChatMessages.id : null;
	const lastSeen = openChatMessages ? openChatMessages.lastSeen + " ago" : "";
	const name = openChatMessages ? openChatMessages.name : "";
	const userPhoneNumber = openChatMessages ? openChatMessages.phoneNumber : "";
	const userCountryCode = openChatMessages ? openChatMessages.countryCode : "";
	const [uplodedImages, setUploadImages] = useState([]);
	const messageSendRef = useRef(null);

	const handleFileChange = async event => {
		event.preventDefault();
		const formData = new FormData();
		formData.append("uploadFile", event.target.files[0]);
		try {
			const response = await fetch(
				"https://api.interakt.ai/v1/organizations/ec245e6c-6ed8-46a4-90bf-6355a257deb1/file/upload/?fileCategory=Inbox_agent_to_customer",
				{
					method: "POST",
					body: formData,
					headers: {
						Authorization: `Token ${process.env.REACT_APP_INTERAKT_API_TOKEN}`,
					},
				}
			);
			const data = await response.json();

			if (data.result && messageSendRef && messageSendRef.current) {
				setUploadImages([...uplodedImages, data["media-url"]]);
				messageSendRef.current.offsetHeight =
					messageSendRef.current.offsetHeight + 50;
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleInputChange = event => {
		setInputValue(event.target.value);
	};

	function handleEmojiClick(event) {
		setInputValue(inputValue + event.emoji);
		inputRef.current.focus();
	}

	useEffect(() => {
		if (messageWindowRef && messageWindowRef.current) {
			messageWindowRef.current.scrollTop =
				messageWindowRef.current.scrollHeight -
				messageWindowRef.current.clientHeight;
		}
	}, [chatDetails]);

	useEffect(() => {
		// Call fetchingMessages initially and every 30 seconds
		const intervalId = setInterval(fetchingMessages(id), 30000);

		// Clean up the interval on unmount
		return () => clearInterval(intervalId);
	}, [id]);

	async function fetchingMessages(id) {
		console.log("Fetching messages every 30second");
		const response = await fetch(
			`https://api.interakt.ai/v1/organizations/ec245e6c-6ed8-46a4-90bf-6355a257deb1/chats/${id}/bundled-conversation/?limit=100&offset=0`,
			{
				headers: {
					Authorization: `Token ${process.env.REACT_APP_INTERAKT_API_TOKEN}`,
				},
			}
		);
		const data = await response.json();
		const sortedData =
			data.results && data.results.data.chat_messages.reverse();
		setChatDetails(sortedData);
		setLoader(false);
	}

	const sendMessageHandler = () => {
		// setLoader(true);
		if (agent.country_code) {
			let dataToSend = {};
			if (uplodedImages.length) {
				dataToSend = {
					message_content_type: "Image",
					media_url: uplodedImages[0],
					message: inputValue,
				};
			} else {
				dataToSend = {
					message: inputValue,
					message_content_type: "Text",
				};
			}
			fetch("https://api.interakt.ai/v1/public/message/", {
				method: "POST",
				headers: {
					Authorization: `Basic ${process.env.REACT_APP_INTERAKT_BASIC_AUTH_TOKEN}`,
				},
				body: JSON.stringify({
					countryCode: userCountryCode,
					phoneNumber: userPhoneNumber,
					type: "Text",
					data: { ...dataToSend },
				}),
			})
				.then(response => response.json())
				.then(data => {
					// TODO: handle showing loader on left side or right side
					setInputValue("");
					setSendingLoader(true);
					setTimeout(() => {
						fetchingMessages(id);
						setSendingLoader(false);
					}, [2000]);
					// setLoader(false);
				})
				.catch(error => {
					console.error("Error:", error);
				});
		}
	};

	const handleEnterPressed = e => {
		if (e.key === "Enter") {
			sendMessageHandler();
		}
	};

	const deleteHandler = imageToDelete => {
		setUploadImages(uplodedImages.filter(image => image !== imageToDelete));
	};
	return (
		<div className="message-window">
			{/* CONTACT DETAILS */}
			<div className="info">
				<div className="contact-thumbnail-container">
					<div className="user-thumbnail">
						{/* check for string character*/}
						{(typeof name[0] === "string" &&
							/[a-zA-Z]/gm.test(name[0][0]) &&
							name[0].toUpperCase()) || (
							<img src={anonymousUser} alt="anonymous_User" width="20px" />
						)}
					</div>
					<div className="user-info">
						<span className="username">{name || "Contact"}</span>
						<span className="salutation">{lastSeen || "0 minutes ago"} </span>
					</div>
				</div>
				{/* <div className="edit">
					<div className="icon plus-icon">+</div>
					<div className="icon attachment">...</div>
					<div className="icon attachment"></div>
				</div> */}
				<Logout />
			</div>
			{/* CONTACT DETAILS */}

			{/* MESSAGES BODY*/}
			<div className="chat">
				<div
					className="chat-messages-wrapper"
					ref={messageWindowRef}
					onClick={() => setShowEmojiPicker(false)}
				>
					{chatDetails &&
						chatDetails.map(chat => {
							return (
								<div
									className={
										chat.chat_message_type === "CustomerMessage"
											? "sendersMessage"
											: "agentMessage"
									}
								>
									<span>{renderMessage(chat)}</span>
								</div>
							);
						})}
					{sendingLoader && <SendingLoader />}
					{showLoader && <div className="message-loader" />}
				</div>
				{/* MESSAGES BODY*/}

				{/* POST MESSAGE - INPUT FIELD */}
				<div className="send" ref={messageSendRef}>
					<span
						className="emoji"
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					>
						<AttachImg src={selectEmoji} alt="send-icon" width="40px" />
					</span>
					<span className="attach-icon">
						<img src={attachIcon} alt="attach-icon" width="40px" />
						<FileUploader
							type="file"
							onChange={handleFileChange}
							name="uploadFile"
							style={{ cursor: "pointer" }}
						/>
					</span>
					{showEmojiPicker && (
						<span className="emoji-picker">
							<EmojiPicker onEmojiClick={handleEmojiClick} />
						</span>
					)}
					<InputWrapper>
						<input
							type="text"
							placeholder="Type a message"
							value={inputValue}
							onChange={handleInputChange}
							ref={inputRef}
							onKeyUp={handleEnterPressed}
						/>
						{!!uplodedImages.length && (
							<ImageWrapper>
								{uplodedImages.map(image => {
									return (
										<div className="uploaded-image">
											<img src={image} alt={image} />
											<div
												className="cross-icon"
												onClick={() => deleteHandler(image)}
											>
												X
											</div>
										</div>
									);
								})}
							</ImageWrapper>
						)}
					</InputWrapper>
					{/* <span className="mic"></span> */}
					<span className="sendmessage" onClick={sendMessageHandler}>
						<img src={sendIcon} alt="send-icon" width="40px" />
					</span>
				</div>

				{/* POST MESSAGE - INPUT FIELD */}
			</div>
		</div>
	);
}

export default MessageWindow;

function renderMessage(message) {
	switch (message.message_content_type) {
		case "Text":
			return (
				<>
					<span>{message.message}</span>
				</>
			);
		case "Audio":
			return (
				<>
					<audio src={message.message} controls />
				</>
			);
		case "Image":
			return (
				<>
					<img src={message.media_url} alt="message" />
					<br />
					<span>{message.message}</span>
				</>
			);
		default:
			return null;
	}
}

export const SendingLoader = () => {
	return (
		<ul className="sending-loader">
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>
	);
};
export const FileUploader = styled.input`
	width: 40px !important;
	padding: 0 !important;
	z-index: 1;
	position: absolute;
	opacity: 0;
	left: 0;
	top: 5px;
`;

export const AttachImg = styled.img`
position: absolute;
cursor: pointer;
z-index: -1;
}`;

export const ImageWrapper = styled.div`
	display: flex;
	margin: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5rem;
	.uploaded-image {
		position: relative;
		border: 1px solid #c6c6c6;
		border-radius: 6px;
		padding: 1rem;
		max-width: 40px;
		overflow: hidden;
		max-height: 40px;
	}
	.uploaded-image {
		.cross-icon {
			position: absolute;
			z-index: 10000;
			top: 0;
			right: -2px;
			border-radius: 50%;
			border-color: white;
			border: 1px solid white;
			padding: 2px 6px;
			font-size: 14px;
			font-weight: 600;
			background-color: grey;
			color: white;
			cursor: pointer;
		}
	}
`;
export const InputWrapper = styled.div`
height: fit-content;
font-size: 18px;
width: calc(100% - 136px);
border-radius: 5px;
padding: 4px 14px;
padding-left: 14px;
display: flex;
flex-direction: column;
justify-content: flex-start;
background-color: white;
.input{
	height: 30px;
}

}`;
