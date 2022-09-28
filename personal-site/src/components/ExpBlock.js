import React from 'react';
import "../style/DynamicRight.css";

class ExpBlock extends React.Component {

    processDesc(desc){
        let bulletPoints = desc.split("--")
        return (
            <ul>
                {bulletPoints.map(function(bullet, i){
                        return <li key={i}>{bullet}</li>
                    })
                }
            </ul>
        )
    }

    getAnimationDelay(delay){
        return {
            webkitAnimationDelay: delay+"s",
            animationDelay:delay+"s"
        }
    }

    render() {
        return (
            <div className="expblock" style={this.getAnimationDelay(this.props.delay)}>
                <div className="expblock-container">
                    <h3 className="experience">{this.props.title}</h3>
                    <a href={this.props.link} target="_blank"><p>{this.props.company}</p></a>
                    <p>{this.props.location}</p>
                    <p>{this.props.dates}</p>
                    {this.processDesc(this.props.description)}
                </div>
            </div>
        )
    }

}

export default ExpBlock