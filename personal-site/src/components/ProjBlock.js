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
            if (type == "link"){
                return (<a href={link} target="_blank"><img className="link-img" src={linkbind} alt="link-svg"></img><p>Link</p></a>)
            }
            else if(type == "github"){
                return (<a href={link} target="_blank"><img className="link-img" src={octocat} alt="octocat-github-logo"></img><p>GitHub Repo</p></a>)
            }
            else if(type == "devpost"){
                return (<a href={link} target="_blank"><img className="link-img" src={devpost} alt="devpost-logo"></img><p>Devpost</p></a>)
            }
            else if(type == "youtube"){
                return (<a href={link} target="_blank"><img className="link-img" src={youtube} alt="youtube-logo"></img><p>Youtube</p></a>)
            }
        }
    }

    render() {
        const [desc, made_with]  = this.props.desc.split("Made with:")
        return (
            <div onClick={this.triggerFlip} className="projblock" style={this.getAnimationDelay(this.props.delay)}>
                    <div className={`projblock-back ${this.props.flipped ? "projblock-flipped" : "projblock-unflipped"}`} > 
                        <div className= "projblock-content">
                            <h3>{this.props.title}</h3>
                            <p>{this.props.subheader}</p>
                            <p>{this.props.date}</p>
                            <p className="desc">{desc}</p>
                            <p className="desc made-with">{"Made with: "+ made_with}</p>
                        </div>
                        <div className= "projblock-side">
                            <img className="main-img" src={require('../img/projects/'+this.props.img)} alt="can't show image"/>
                            {this.getLink(this.props.github, "github")}
                            {this.getLink(this.props.link, "link")}
                            {this.getLink(this.props.devpost, "devpost")}
                            {this.getLink(this.props.youtube, "youtube")}
                        </div>
                    </div>
                    <div className="projblock-front">
                        <img src={require('../img/projects/'+this.props.img)} alt="can't show image"/>
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