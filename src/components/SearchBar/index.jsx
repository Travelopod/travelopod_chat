import React, { useEffect } from "react";
import "./index.css";
import anonymousUser from "../../assets/icon/anonymousUser.svg";

export default function SearchBar({ setOpenChatMessages, agent, name }) {
	const [searchedContact, setSearchedContact] = React.useState("");
	const [contactDetails, setContactDetails] = React.useState([]);
	const [chatContactLimit, setChatContactLimit] = React.useState(10);
	const [showLoader, setLoader] = React.useState(false);

	const scrollRef = React.useRef(null);

	const user =
		localStorage.getItem("agent") && JSON.parse(localStorage.getItem("agent"));
	const contactsScrollHandler = () => {
		if (scrollRef && scrollRef.current !== null) {
			let movedScroll = scrollRef.current.scrollTop;
			let scrollHeight = scrollRef.current.scrollHeight;
			let elementHeight = scrollRef.current.clientHeight;
			// scrollHeight remains same irrespective of device height while elementHeight changes with device height
			if (scrollHeight - elementHeight === movedScroll) {
				// we will know, it has reached the end of scrollbar and we would increment chatContactLimit value by 10.
				setTimeout(() => setChatContactLimit(chatContactLimit + 50), 500);
				setLoader(true);
			}
		}
	};

	useEffect(() => {
		agent &&
			fetch(
				`https://api.interakt.ai/v1/organizations/ec245e6c-6ed8-46a4-90bf-6355a257deb1/chats/?type=active&limit=${chatContactLimit}&assigned=&agentId=${agent.id}&offset=0&sortBy=desc`,
				{
					headers: {
						Authorization: "Token cc3432eb05b21d5e389b6c4ab51001ff2472380d",
					},
				}
			)
				.then(response => response.json())
				.then(data => {
					data.results && setContactDetails(data.results.data);
					setLoader(false);
				});
	}, [chatContactLimit]);

	const filteredItems =
		searchedContact !== "" &&
		contactDetails.filter(contact =>
			contact.customer_id.traits.name
				.toLowerCase()
				.match(searchedContact.toLowerCase())
		);

	const userProfile = user
		? {
				fullName: user.first_name + " " + user.last_name,
				email: user.email,
		  }
		: null;

	return (
		<div className="sidebar">
			{/* user-info */}
			<div className="user-thumbnail-container">
				<div>
					<div className="user-thumbnail">
						{/* {userProfile && userProfile.fullName[0]} */}

						{userProfile && name[0]}
					</div>
					<div className="user-info">
						<span className="salutation">Hello</span>
						<span className="username">
							{/* {userProfile && userProfile.fullName} */}
							{userProfile && name}
						</span>
					</div>
				</div>
				<div className="edit">
					<div className="icon plus-icon">+</div>
					<div className="icon bell-icon">+</div>
					<div className="icon search-icon">+</div>
				</div>
			</div>

			{/* search-bar */}
			<div className="search">
				<input
					type="text"
					placeholder="Search or start a new chat"
					value={searchedContact}
					onChange={e => setSearchedContact(e.target.value)}
				/>
			</div>
			{/* recent chats */}
			<div className="recent" ref={scrollRef} onScroll={contactsScrollHandler}>
				<ul className="chats">
					{[
						...(filteredItems.length
							? [...filteredItems]
							: [...contactDetails]),
					].map(contact => {
						let lastSeen = getLastMessageTime(
							contact.last_customer_message_at_utc
						);
						return (
							<li
								key={contact.id}
								onClick={() =>
									setOpenChatMessages({
										id: contact.id,
										name: contact.customer_id.traits.name,
										lastSeen: lastSeen,
										phoneNumber: contact.customer_id.phone_number,
										countryCode: contact.customer_id.country_code,
									})
								}
							>
								<div className="user-thumbnail">
									{/* check for string character*/}
									{(typeof contact.customer_id.traits.name[0] === "string" &&
										/[a-zA-Z]/gm.test(contact.customer_id.traits.name[0][0]) &&
										contact.customer_id.traits.name[0].toUpperCase()) || (
										<img
											src={anonymousUser}
											alt="anonymous_User"
											width="20px"
										/>
									)}
								</div>
								<div className="details">
									<span className="name">
										{contact.customer_id.traits.name}
									</span>
									{/* TODO: Fetch API to check if last message was read */}
									<span
										className={
											contact.last_message.message_status === "Delivered" ||
											contact.last_message.message_status === "Sent"
												? "read-last-seen"
												: "active-last-seen"
										}
									>
										{lastSeen}
									</span>
									<span className="message">
										{contact.last_message.message}
									</span>
								</div>
							</li>
						);
					})}
					{showLoader && <div class="loader" />}
				</ul>
			</div>
		</div>
	);
}

// finding msg time ago
function getLastMessageTime(date) {
	return msToTime(Date.now() - new Date(date).getTime());
}
// converting milliseconds for time ago
function msToTime(ms) {
	// toFixed remove any decimal Points
	let seconds = (ms / 1000).toFixed();
	let minutes = (ms / (1000 * 60)).toFixed();
	let hours = (ms / (1000 * 60 * 60)).toFixed();
	let days = (ms / (1000 * 60 * 60 * 24)).toFixed();
	if (seconds < 60) return seconds + " Sec";
	else if (minutes < 60) return minutes + " Min";
	else if (hours < 24) return hours === "1" ? hours + " Hour" : hours + " Hrs";
	else return days === "1" ? days + " Day" : days + " Days";
}
