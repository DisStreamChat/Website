import React, { useContext } from 'react';
import { AppContext } from '../../../contexts/Appcontext';
import TwitchAccount from './TwitchComponent';
import "./Accounts.scss"
import DiscordAccount from './DiscordComponent';

const Account = () => {

    const { currentUser } = useContext(AppContext);

    return (
        <div classname="accounts" style={{width: "100%"}}>
            <TwitchAccount/>
            <DiscordAccount/>
        </div>
    );
}

export default Account;
