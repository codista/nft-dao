import React, { Component } from 'react'

class NFTValueComp extends Component {

  render() {
    return (
      <div id="content">
        <form onSubmit={(event) => {
          event.preventDefault()
          this.props.getNFTValue(this.NFTContractAddress.value,this.NFTID.value)
        }}>
          <input id="NFTContractAddress" ref={(input) => this.NFTContractAddress = input} type="text" className="form-control" placeholder="NFT Contract Address..." required />
          <input id="NFTID" ref={(input) => this.NFTID = input} type="text" className="form-control" placeholder="NFT ID..." required />
          <input type="submit" hidden={false} />
        </form>
        
        <div className="taskTemplate">
        <label>
            
            <span className="content"> {this.NFTValue}</span>
        </label>
        </div>
            
        <ul id="completedTaskList" className="list-unstyled">
        </ul>
      </div>
    );
  }
}

export default NFTValueComp;