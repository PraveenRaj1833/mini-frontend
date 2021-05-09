import { Button } from 'react-bootstrap'
import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

export class Course extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             course : ''
        }
    }
    
    render() {
        return (
            <div>
                <h1>Course </h1>
                <Button onClick={()=>{
                    this.props.history.push('/teacher/createTest');
                }}>Create Test</Button>
            </div>
        )
    }
}

export default withRouter(Course)
