import React from 'react';
import '../docs/css/loader.css'

const Spinner = (props) => {
    return (
        <div className = "ui active dimmer whiter spinner">
            <div className = "ui big text loader">{props.text}</div>
        </div>
    );
};

Spinner.defaultProps = {
    text: "Loading..."
};

export default Spinner;