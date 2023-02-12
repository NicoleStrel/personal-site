import React from 'react';
import "../style/DynamicRight.css";

class ExpBlock extends React.Component {

    processDesc(desc){
        let sections = desc.split(":")  
        const desc_return = []

        for(let i = 0; i < sections.length; i++){ 
            if (i%2 == 0){
                desc_return.push(<p>{sections[i]}</p>)
            }
            else{
                let bulletPoints = sections[i].split("--")
                desc_return.push(
                    <ul>
                        {bulletPoints.map(function(bullet, i){
                                return <li key={i}>{bullet}</li>
                            })
                        }
                    </ul>
                )
            }
        }

        return desc_return
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
                    <p className="exp-dates">{this.props.dates}</p>
                    {this.processDesc(this.props.description)}
                </div>
            </div>
        )
    }

}

export default ExpBlock