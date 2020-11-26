import "./Bot.scss";
import A from "../Shared/A";
import Feature from "../Shared/Feature";

const Bot = () => {
	return (
		<>
			<div className="hero">
				<div className="description">
					<div className="text">
						<h1>The best utility bot for Discord</h1>
						<p>
							Manage your server and keep members engaged with an auto moderator, a
							high quality leveling system, Versatile custom commands, a robust role
							management system, and much more!
						</p>
					</div>
					<div className="buttons hero-buttons">
						<A href="#bot" className="main-button dashboard-button">
							See Features
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
			<div className="landing" id="bot">
				<Feature
					title="Keep members engaged with leveling"
					body="Let the members of your server level up by being active in your server. People can compete for the top spots of the leaderboard with spam protection. "
					images={[`${process.env.PUBLIC_URL}/leveling-merge.png`]}
					imageClassNames={["drop-shadow"]}
				></Feature>
				<Feature
					title="Extend the bot with custom commands"
					body="Give extra information, fun interactions, and other custom things with custom commands. Take advantage of the variables and arguments to make truly interactive commands tailored to your server."
					images={[`${process.env.PUBLIC_URL}/custom-merge.png`]}
					imageClassNames={["drop-shadow"]}
					reversed
				></Feature>
				<Feature
					title="Get information about users and the server"
					body="With some default commands you can get information about users who join your server like how old their account is. Members can also get information about your server and the roles in it."
					images={[`${process.env.PUBLIC_URL}/info-merge.png`]}
					imageClassNames={["drop-shadow"]}
				></Feature>
				<Feature
					title="Log anything that goes on in your server"
					body="Keep track of things that go on in your server by logging the things most important to you. By logging deleted and edited messages you can prevent people from getting away with breaking the rules, and all the other events let you keep track of the server."
					images={[`${process.env.PUBLIC_URL}/logging-merge.png`]}
					imageClassNames={["drop-shadow"]}
					reversed
				></Feature>
			</div>
		</>
	);
};

export default Bot;
