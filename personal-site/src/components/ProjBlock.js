import React from 'react';
import "../style/DynamicRight.css";
import octocat from '../img/links/octocat.svg'
import linkbind from '../img/links/link-bind.svg'

class ProjBlock extends React.Component {
    constructor(props) {
        super(props);
        this.triggerFlip = this.triggerFlip.bind(this);
    }

    triggerFlip() {
        this.props.onFlip(this.props.i);
    }

    formatLink(linkurl){
        linkurl = linkurl.replace("https://", '')
        linkurl = linkurl.replace("http://", '')
        linkurl = linkurl.replace("/", '')
        return linkurl
    }

    render() {
        return (
            <div onClick={this.triggerFlip} className="projblock">
                    <div className={`projblock-back ${this.props.flipped ? "projblock-flipped" : "projblock-unflipped"}`} > 

                        <div className= "projblock-content">
                            <h3>{this.props.title}</h3>
                            <p>{this.props.subheader}</p>
                            <p>{this.props.date}</p>
                            <p className="desc">{this.props.desc}</p>
                        </div>
                        <div className= "projblock-side">
                            <img className="main-img" src={require('../img/projects/'+this.props.img)} alt="can't show image"/>
                            <a href={this.props.github} target="_blank"><img className="link-img" src={octocat} alt="octocat-github-logo"></img><p>GitHub Repo</p></a>
                            <br/>
                            <a href={this.props.link} target="_blank"><img className="link-img" src={linkbind} alt="link-svg"></img><p>{this.formatLink(this.props.link)}</p></a>
                        </div>
                    </div>
                    <div className="projblock-front">
                        <img src={require('../img/projects/'+this.props.img)} alt="can't show image"/>
                        <h3>{this.props.title}</h3>
                        <p>{this.props.subheader}</p>
                        <p>{this.props.date}</p>
                    </div>
                </div> 
        )
    }
}

export default ProjBlock