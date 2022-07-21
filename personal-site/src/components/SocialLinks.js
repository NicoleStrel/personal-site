import React from 'react';
import "../style/App.css";
import devpost from '../img/social_links/devpost.svg'
import envelope from '../img/social_links/envelope.svg'
import github from '../img/social_links/github.svg'
import linkedin from '../img/social_links/linkedin.svg'

class SocialLinks extends React.Component {


    render() {
        return (
            <div className="social-links">
                <a href="https://www.linkedin.com/in/nicole-streltsov/" target="_blank"><img className="linkedin" src={linkedin} alt="linkedin-logo"></img></a>
                <a href="https://github.com/NicoleStrel" target="_blank"><img className="github" src={github} alt="github-logo"></img></a>
                <a href="mailto:nicole.streltsov@mail.utoronto.ca" target="_blank"><img className="envelope" src={envelope} alt="mail-logo"></img></a>
                <a href="https://devpost.com/NicoleStrel" target="_blank"><img className="devpost" src={devpost} alt="devpost-logo"></img></a>
            </div>
        )
    }

}

export default SocialLinks