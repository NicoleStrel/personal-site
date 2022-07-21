import React from 'react';
import "../style/App.css";

class Tab extends React.Component {


    render() {
        return (
            <div className="tab">{this.props.content}</div>
        )
    }

}

export default Tab