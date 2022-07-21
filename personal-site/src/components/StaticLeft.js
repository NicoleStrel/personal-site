import React from 'react';
import "../style/StaticLeft.css";
import "../style/App.css";
import utoronto from '../img/utoronto.png';
import sketch from '../img/sketch.png';
import Tab from './Tab';
import SocialLinks from './SocialLinks';

class StaticLeft extends React.Component {

    skills = ['Python', 'C', 'Javascript', 'Django', 'React', 'PostgresSQL', 'NodeJS', 'Vue', 'Tensorflow/Pytorch', 'Matlab']

    render() {
        return (
            <div className="split staticLeft">
                <div className="centered-container">
                    <div className="centered-content">
                        <img className="sketch" src={sketch} alt="portrait-sketch"></img>
                        <div className="inline">
                            <h1 className="nicole">Nicole</h1>
                            <h1 className="streltsov">Streltsov</h1>
                        </div>
                        <p>Software Engineer</p>
                        <SocialLinks/>
                        <div className="school">
                            <a href="https://www.utoronto.ca/" target="_blank"><img className="uoft-logo" src={utoronto} alt="uoft-logo"></img></a>
                            <p>Engineering Science, major in Machine Intelligence at the University of Toronto</p>
                        </div>
                    </div>
                    <div className="skills">
                            {this.skills.map(function(skill, i){
                                    return <Tab key={i} content={skill}></Tab>
                                })
                            }
                    </div>
                    
                </div>
            </div>
        )
    }

}

export default StaticLeft