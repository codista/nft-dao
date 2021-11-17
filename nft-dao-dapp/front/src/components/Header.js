import React from 'react'
import ConnectButton from "./ConnectButton"
const Header = ({connected,connectFunc}) => {
    return (
        <header>
           <h1>NFT Expert Appraisal</h1> 
           <ConnectButton  connected={connected} connectFunc={connectFunc} />
        </header>
    )
}

export default Header
