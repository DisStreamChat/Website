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
						Keep your members engaged and entertained with a top-notch leveling system.
						Reward them with XP points and keep track of the most active members on your
						customizable leaderboard.
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
