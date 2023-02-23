import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import EmojiPicker from "emoji-picker-react";
import sendIcon from "../../assets/icon/send-icon.svg";
import selectEmoji from "../../assets/icon/emoji-happy.svg";

function MessageWindow({ openChatMessages }) {
	// all the chat-messages for the specific customer
	const [chatDetails, setChatDetails] = useState([]);
	// storing values in input field
	const [inputValue, setInputValue] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	// to add focus to input field while adding emojis
	const inputRef = useRef(null);

	const id = openChatMessages ? openChatMessages.id : null;
	const lastSeen = openChatMessages ? openChatMessages.lastSeen + " ago" : "";
	const name = openChatMessages ? openChatMessages.name : "";

	const handleInputChange = event => {
		setInputValue(event.target.value);
	};

	function handleEmojiClick(event) {
		setInputValue(inputValue + event.emoji);
		inputRef.current.focus();
	}

	useEffect(() => {
		fetch(
			`https://api.interakt.ai/v1/organizations/ec245e6c-6ed8-46a4-90bf-6355a257deb1/chats/${id}/bundled-conversation/?limit=100&offset=0`,
			{
				headers: {
					Authorization: "Token cc3432eb05b21d5e389b6c4ab51001ff2472380d",
				},
			}
		)
			.then(response => response.json())
			.then(data => data.results && setChatDetails(data.results.data));
	}, [id]);

	// const lastSeenMsg =
	// 	chatDetails.length &&
	// 	chatDetails.chat_events.length &&
	// 	chatDetails.chat_events.filter(
	// 		event => event.chat_event_type === "ChatActivated"
	// 	);

	return (
		<div className="message-window">
			{/* CONTACT DETAILS */}
			<div className="info">
				<div className="contact-thumbnail-container">
					<div className="user-thumbnail"></div>
					<div className="user-info">
						<span className="username">{name}</span>
						<span className="salutation">{lastSeen} </span>
					</div>
				</div>
				<div className="edit">
					<div className="icon plus-icon">+</div>
					<div className="icon attachment">...</div>
					<div className="icon attachment"></div>
				</div>
			</div>
			{/* CONTACT DETAILS */}

			{/* MESSAGES BODY*/}
			<div className="chat">
				<div
					className="chat-messages-wrapper"
					onClick={() => setShowEmojiPicker(false)}
				>
					{chatDetails &&
						chatDetails.chat_messages &&
						chatDetails.chat_messages.map(chat => {
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
					/>

					{/* <span className="mic"></span> */}
					<span className="sendmessage">
						<img src={sendIcon} alt="send-icon" width="40px" />
					</span>
				</div>
				{/* POST MESSAGE - INPUT FIELD */}
			</div>
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
