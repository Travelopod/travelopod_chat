import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import EmojiPicker from "emoji-picker-react";
import sendIcon from "../../assets/icon/send-icon.svg";
import selectEmoji from "../../assets/icon/emoji-happy.svg";
import attachIcon from "../../assets/icon/attachment.svg";
import anonymousUser from "../../assets/icon/anonymousUser.svg";
import Logout from "../../routes/Logout";
import FileUploaderModal from "../FileUploaderModal";

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
	const [showFileUpload, setShowFileUpload] = React.useState(false);

	const id = openChatMessages ? openChatMessages.id : null;
	const lastSeen = openChatMessages ? openChatMessages.lastSeen + " ago" : "";
	const name = openChatMessages ? openChatMessages.name : "";
	const userPhoneNumber = openChatMessages ? openChatMessages.phoneNumber : "";
	const userCountryCode = openChatMessages ? openChatMessages.countryCode : "";

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
			fetch("https://api.interakt.ai/v1/public/message/", {
				method: "POST",
				headers: {
					Authorization: `Basic ${process.env.REACT_APP_INTERAKT_BASIC_AUTH_TOKEN}`,
				},
				body: JSON.stringify({
					countryCode: userCountryCode,
					phoneNumber: userPhoneNumber,
					type: "Text",
					data: {
						message: inputValue,
					},
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
									<span>
										{renderMessage(chat.message_content_type, chat.message)}
									</span>
								</div>
							);
						})}
					{sendingLoader && <SendingLoader />}
					{showLoader && <div className="message-loader" />}
				</div>
				{/* MESSAGES BODY*/}

				{/* POST MESSAGE - INPUT FIELD */}
				<div className="send">
					<span
						className="emoji"
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					>
						<img src={selectEmoji} alt="send-icon" width="40px" />
					</span>
					<span className="attach-icon" onClick={() => setShowFileUpload(true)}>
						<img src={attachIcon} alt="attach-icon" width="40px" />
					</span>
					{showEmojiPicker && (
						<span className="emoji-picker">
							<EmojiPicker onEmojiClick={handleEmojiClick} />
						</span>
					)}
					<input
						type="text"
						placeholder="Type a message"
						value={inputValue}
						onChange={handleInputChange}
						ref={inputRef}
						onKeyUp={handleEnterPressed}
					/>

					{/* <span className="mic"></span> */}
					<span className="sendmessage" onClick={sendMessageHandler}>
						<img src={sendIcon} alt="send-icon" width="40px" />
					</span>
				</div>

				{/* POST MESSAGE - INPUT FIELD */}
			</div>

			{/* FileUpload */}

			{showFileUpload && (
				<FileUploaderModal
					attachImagesHandler={images =>
						images.length && setInputValue(...inputValue, ...images.join(","))
					}
					close={() => setShowFileUpload(false)}
				/>
			)}
		</div>
	);
}

export default MessageWindow;

function renderMessage(message_content_type, message) {
	switch (message_content_type) {
		case "Text":
			return (
				<>
					<span>{message}</span>
				</>
			);
		case "Audio":
			return (
				<>
					<audio src={message} controls />
				</>
			);
		case "CallUs":
			const handleCallUs = () => console.log("callUs");
			return (
				<>
					<button onClick={handleCallUs}>Call Us</button>
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
