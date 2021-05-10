import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

export class ViewTest extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            totalMarks : '',
            duration : '',
            date : '',
            courseId : localStorage.getItem('courseId'),
            time : '',
            dateTime : '',
            questions : []
        }
    }
    
    componentDidMount = ()=>{
        
    }

    render() {
        return (
            <div className="m-4">
                <div className="row m-1">

                </div>
            </div>
        )
    }
}

export default withRouter(ViewTest)
