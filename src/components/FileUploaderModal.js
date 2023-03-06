import React, { useState } from "react";
import styled from "styled-components";

export default function FileUploaderModal({ attachImagesHandler, close }) {
	const [file, setFile] = useState(null);
	const [uplodedImages, setUploadImages] = useState([]);
	const handleFileChange = event => {
		setFile(event.target.files[0]);
	};
	const handleSubmit = async event => {
		event.preventDefault();
		const formData = new FormData();
		formData.append("uploadFile", file);
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
			data.result && setUploadImages([...uplodedImages, data["media-url"]]);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<Wrapper>
			<form onSubmit={handleSubmit}>
				<div>
					<h2>FileUploaderModal</h2>
					<div class="file-upload-button-wrapper">
						<button class="file-upload" type="submit">
							+
						</button>
						<button class="close" type="button" onClick={close}>
							X
						</button>
					</div>
				</div>
				<input type="file" onChange={handleFileChange} name="uploadFile" />
			</form>
			<ImageWrapper>
				{uplodedImages.length &&
					uplodedImages.map(image => {
						return (
							<div className="uploaded-image">
								<img src={image} alt={image} />
							</div>
						);
					})}
			</ImageWrapper>
			<button onClick={attachImagesHandler(uplodedImages)}>Send</button>
		</Wrapper>
	);
}
export const Wrapper = styled.div`
	height: 50vh;
	position: absolute;
	background-color: white;
	border: 1px solid black;
	border-radius: 12px;
	padding: 1rem;
	width: 50vw;
	h2 {
		text-align: center;
	}
	form {
		display: flex;
		flex-direction: column;
		div {
			display: flex;
			justify-content: space-between;
		}
	}
	.file-upload-button-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;

		.file-upload {
			height: 50px;
			width: 50px;
			border-radius: 100px;
			position: relative;

			display: flex;
			justify-content: center;
			align-items: center;

			border: 4px solid #ffffff;
			overflow: hidden;
			background-image: linear-gradient(to bottom, #2590eb 50%, #ffffff 50%);
			background-size: 100% 200%;
			transition: all 1s;
			color: #ffffff;
			font-size: 35px;
			font-weight: 800;
			cursor: pointer;

			&:hover {
				background-position: 0 -100%;
				color: #2590eb;
			}
		}
	}
`;

export const ImageWrapper = styled.div`
	display: flex;
	margin: 1rem;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 0.5rem;
	.uploaded-image {
		border: 1px solid #c6c6c6;
		border-radius: 6px;
		padding: 1rem;
	}
`;
