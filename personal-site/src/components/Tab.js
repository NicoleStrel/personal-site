import React from 'react';
import "../style/App.css";

class Tab extends React.Component {

   getAnimationDelay(delay){
        return {
            webkitAnimationDelay: delay+"s",
            animationDelay:delay+"s"
        }
   }

    render() {
        return (
            <div className="tab" style={this.getAnimationDelay(this.props.delay)}>{this.props.content}</div>
        )
    }

}

export default Tab