import React, { createContext, useState } from "react";

// Create a context object
export const UserContext = createContext();

// Create a provider for the context
export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const updateUser = newUser => {
		setUser(newUser);
		console.log(user);
	};

	return (
		<UserContext.Provider value={{ user, updateUser }}>
			{children}
		</UserContext.Provider>
	);
};
