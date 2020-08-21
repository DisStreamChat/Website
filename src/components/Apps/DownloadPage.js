import React, { useEffect, useState } from "react";
import A from "../Shared/A";
import { Button } from "@material-ui/core";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import Feature from "../Shared/Feature";

const DownloadPage = () => {
	return (
		<div className="download-page">
			<div className="left">
				<Feature
					title="DisStreamChat Chat Client"
					subtitle="All your stream chats in one place"
					body="Keeping track of your stream can be really difficult, especially if you are streaming cross platform and have large discord
					community. DisStreamChat allows you have all your chats in one place so you can easily view and moderate the chat."
                    images={["https://panels-images.twitch.tv/panel-40229165-image-1b8f110f-2370-4af4-9610-a6bcb9ee8872"]}
                ></Feature>
			</div>
			<div className="right downloads">
				<div className="download-item">
					<div className="heading">
						<h1>Download for Windows</h1>
					</div>
                    <img src={`${process.env.PUBLIC_URL}/windows.webp`} width="100" alt=""/>
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
                    <img src={`${process.env.PUBLIC_URL}/linux.png`} width="100" alt=""/>
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
                    <img src={`${process.env.PUBLIC_URL}/apple.png`} width="64" style={{filter: "invert(1)"}} alt=""/>
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
