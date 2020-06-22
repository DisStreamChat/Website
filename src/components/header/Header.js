import React, { useContext, useEffect, useState } from 'react';
import "./Header.scss"
import {Link, withRouter} from "react-router-dom"
import { AppContext } from '../../contexts/Appcontext';
import {CSSTransition} from "react-transition-group"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useCallback } from 'react';
import Modal from "react-modal"
import YouTubeIcon from '@material-ui/icons/YouTube';
import A from '../Shared/A';
import ClearIcon from '@material-ui/icons/Clear';
import firebase from "../../firebase"
import HamburgerMenu from "react-hamburger-menu"

Modal.setAppElement("#root");

const Header = props => {
	const { currentUser, setCurrentUser } = useContext(AppContext);
	const { dropDownOpen: open, setDropDownOpen: setOpen } = useContext(
		AppContext
	);
	const [userDropDown, setUserDropDown] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);

	useEffect(() => {
		setUserDropDown(d => d && !!currentUser);
	}, [currentUser]);

	const user = firebase.auth.currentUser;

	useEffect(() => {
		if (user) {
			const unsub = firebase.db
				.collection("Streamers")
				.doc(user.uid)
				.onSnapshot(snapshot => {
					const data = snapshot.data();
					if (data) {
						const { displayName, profilePicture } = data;
						setCurrentUser({
							name: displayName,
							profilePicture,
						});
					}
				});
			return unsub;
		}
	}, [user, setCurrentUser]);

	const signInWithGoogle = useCallback(async () => {
		const provider = new firebase.app.auth.GoogleAuthProvider();
		try {
			const result = await firebase.auth.signInWithPopup(provider);
			const user = result.user;
			console.log(user);
			const { displayName, photoURL: profilePicture } = user;
			firebase.auth.currentUser.updateProfile({
				displayName: user.displayName,
			});
			setLoginOpen(false);
			try {
				await firebase.db.collection("Streamers").doc(user.uid).update({
					displayName,
					profilePicture,
				});
			} catch (err) {
				await firebase.db
					.collection("Streamers")
					.doc(user.uid)
					.set({
						displayName,
						uid: user.uid,
						profilePicture,
						ModChannels: [],
						TwitchName: displayName.toLowerCase(),
						appSettings: {
							TwitchColor: "",
							YoutubeColor: "",
							discordColor: "",
							displayPlatformColors: false,
							displayPlatformIcons: false,
							highlightedMessageColor: "",
							showHeader: true,
							showSourceButton: false,
						},
						discordLinked: false,
						guildId: "",
						liveChatId: "",
						overlaySettings: {
							TwitchColor: "",
							YoutubeColor: "",
							discordColor: "",
							displayPlatformColors: false,
							displayPlatformIcons: false,
							highlightedMessageColor: "",
						},
						twitchAuthenticated: true,
						youtubeAuthenticated: false,
					});
			}
		} catch (err) {
			console.log(err.message);
		}
	}, []);

    return (
        <header className="header">
            <Modal
                isOpen={loginOpen}
                className="Modal"
                overlayClassName="Modal-Overlay"
                onRequestClose={() => setLoginOpen(false)}
            >
                <button className="exit-button" onClick={() => setLoginOpen(false)}><ClearIcon/></button>
                <h1 className="modal-heading">Login to DisStreamChat</h1>
                <h2 className="modal-subheading">Connect with:</h2>
                <div className="modal-buttons">
                    <A href={`https://id.twitch.tv/oauth2/authorize?client_id=ip3igc72c6wu7j00nqghb24duusmbr&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=openid%20moderation:read`} className="modal-button twitch"><img src={`${process.env.PUBLIC_URL}/social-media.svg`} alt="" width="20" className="logo-icon" />Twitch</A>
                    <div className="modal-button youtube" onClick={signInWithGoogle}><YouTubeIcon className="logo-icon yt-icon" />YouTube</div>
                </div>
            </Modal>
            <div className="hamburger-holder">
                <HamburgerMenu
                    isOpen={open}
                    menuClicked={() => setOpen(u => !u)}
                    strokeWidth={3}
                    rotate={0}
                    color='white'
                    borderRadius={5}
                    animationDuration={0.5}
                />
            </div>
            <span className="header--left"> 
                <Link to="/" className="logo">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt=""/>
                </Link>
                <nav className={`nav-bar ${open && "open"}`}>
                    <Link to="/bot">Discord Bot</Link>
                    <Link to="/apps">Apps</Link>
                    <Link to="/community">Community</Link>
                    {/* <Link to="/about">About</Link> */}
                </nav>
            </span>
            <span className="header--right">
                {!currentUser ? 
                    <button className="login-button" onClick={() => setLoginOpen(true)}>
                        Login
                    </button> : 
                    <ClickAwayListener onClickAway={() => setUserDropDown(false)}>
                    <div className="full-user">
                        <button className="user" onClick={() => setUserDropDown(d => !d)}>
                            <span className="user--name">{currentUser.name}</span>
                            <img className="profile-picture" src={currentUser.profilePicture} alt=""></img>
                        </button>
                        <CSSTransition unmountOnExit in={userDropDown} timeout={200} classNames="user-node">
                            <div className="user-dropdown">
                                <Link onClick={() => setUserDropDown(false)} to={`/dashboard/${firebase.auth.currentUser.uid}`} className="user-item">Dashboard</Link>
                                <div onClick={async () => {await firebase.logout(); setCurrentUser(null)}} className="user-item logout">Logout</div>
                            </div>
                        </CSSTransition>
                    </div>
                    </ClickAwayListener>
                }
            </span>
        </header>
    );
}

export default withRouter(Header);
