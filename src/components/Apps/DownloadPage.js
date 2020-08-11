import React, { useEffect, useState } from "react";
import A from "../Shared/A";
import { Button } from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

const DownloadPage = () => {
	return (
		<div className="download-page">
			<div className="left">
				<h1>DisStreamChat Chat Client</h1>
				<h2>All your stream chats in one place</h2>
				<p>
					Keeping track of your stream can be really difficult, especially if you are streaming cross platform and have large discord
					community. DisStreamChat allows you have all your chats in one place so you can easily view and moderate the chat.
				</p>
			</div>
			<div className="right downloads">
				<div className="download-item">
					<div className="heading">
						<h1>Download for Windows</h1>
					</div>
					<div className="download-links">
						<A href="https://api.disstreamchat.com/app" newTab>
							<Button className="download-button">Latest Version</Button>
						</A>
					</div>
				</div>
				<div className="download-item">
					<div className="heading">
						<h1>Download for Linux</h1>
					</div>
					<div className="download-links">
						<A href="https://i.lungers.com/disstreamchat/linux" newTab>
							<Button className="download-button">Latest Version</Button>
						</A>
					</div>
				</div>
				<div className="download-item">
					<div className="heading">
						<h1>Download for Mac</h1>
					</div>
					<div className="download-links">
						<A href="https://i.lungers.com/disstreamchat/darwin" newTab>
							<Button className="download-button">Latest Version</Button>
						</A>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DownloadPage;
