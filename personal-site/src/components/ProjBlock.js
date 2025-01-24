import React from 'react';
import "../style/DynamicRight.css";
import octocat from '../img/links/octocat.svg'
import linkbind from '../img/links/link-bind.svg'
import devpost from '../img/links/devpost.svg'
import youtube from '../img/links/youtube.svg'

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

    getAnimationDelay(delay){
        return {
            webkitAnimationDelay: delay+"s",
            animationDelay:delay+"s"
        }
    }
    
    getLink(link, type) {
        if (link) {
            if (type === "link"){
                return (<a href={link} target="_blank" rel="noreferrer"><img className="link-img" src={linkbind} alt="Link"></img><p>Link</p></a>)
            }
            else if(type === "github"){
                return (<a href={link} target="_blank" rel="noreferrer"><img className="link-img" src={octocat} alt="GitHub"></img><p>GitHub Repo</p></a>)
            }
            else if(type === "devpost"){
                return (<a href={link} target="_blank" rel="noreferrer"><img className="link-img" src={devpost} alt="Devpost"></img><p>Devpost</p></a>)
            }
            else if(type === "youtube"){
                return (<a href={link} target="_blank" rel="noreferrer"><img className="link-img" src={youtube} alt="YouTube"></img><p>Youtube</p></a>)
            }
        }
    }

    getText(description) {
        const [desc, made_with]  = description.split("Made with:")
        return (
            <div>
                <p className="desc">{desc}</p>
                <p className="desc made-with">{"Made with: "+ made_with}</p>
            </div>
        )
    }

    render() {
        
        return (
            <div onClick={this.triggerFlip} className="projblock" style={this.getAnimationDelay(this.props.delay)}>
                    <div className={`projblock-back ${this.props.flipped ? "projblock-flipped" : "projblock-unflipped"}`} > 
                        <div className="projblock-container">
                            <div className= "projblock-content">
                                <h3>{this.props.title}</h3>
                                <p>{this.props.subheader}</p>
                                <p>{this.props.date}</p>
                                <div className="proj-text-desktop">{this.getText(this.props.desc)}</div>
                            </div>
                            <div className= "projblock-side">
                                <div className="close-div">
                                    <p className="close-bttn">X</p>
                                </div>
                                <img className="main-img" src={require('../img/projects/'+this.props.img)} alt="can't show"/>
                                {this.getLink(this.props.github, "github")}
                                {this.getLink(this.props.link, "link")}
                                {this.getLink(this.props.devpost, "devpost")}
                                {this.getLink(this.props.youtube, "youtube")}
                            </div>
                        </div>
                        <div className="proj-text-mobile"> {this.getText(this.props.desc)}</div>
                    </div>
                    <div className="projblock-front">
                        <img src={require('../img/projects/'+this.props.img)} alt="can't show"/>
                        <div className="projblock-text">
                            <h3>{this.props.title}</h3>
                            <p>{this.props.date}</p>
                            <br></br>
                            <p>{this.props.subheader}</p>
                        </div>
                    </div>
                </div> 
        )
    }
}

export default ProjBlock