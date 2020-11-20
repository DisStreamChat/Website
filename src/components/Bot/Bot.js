import "./Bot.scss";
import A from "../Shared/A";
import Feature from "../Shared/Feature";

const Bot = () => {
	return (
		<div className="hero">
			<div className="description">
				<div className="text">
					<h1>The best utility bot for Discord</h1>
					<p>
						Manage your server and keep members engaged with an auto moderator, a high quality leveling system, Versatile custom commands, a robust role management system, and much more!
					</p>
				</div>
				<div className="buttons hero-buttons">
					<A href="/dashboard/discord" local className="main-button dashboard-button">
						Get Started
					</A>
					<A
						href="https://api.disstreamchat.com/invite"
						className="main-button dashboard-button"
					>
						Add to Discord
					</A>
				</div>
			</div>
			<div className="image">
				<img className="hover" src="/bot-hero.gif" alt="" />
			</div>
		</div>
	);
};

export default Bot;
