import React from 'react';
import Progress from '../common/Progress';

class Blank extends React.Component {

    render() {
        return (
            <div>
                <Progress />
                {this.props.children}
            </div>
        )
    }

}

export default Blank