import { Button } from 'reactstrap'
import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

class StudentViewTest extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            totalMarks : '',
            testId : localStorage.getItem('testId'),
            duration : '',
            completeDate : '',
            courseId : localStorage.getItem('courseId'),
            time : '',
            dateTime : '',
            stage : -1
            //questions : []
        }
    }

    componentDidMount =()=>{
        const test = JSON.parse(localStorage.getItem('test'))
        if(test!==null){
            this.setState({
                totalMarks : test.totalMarks,
                duration : test.duration,
                dateTime : test.dateTime,
            },()=>{
                const date = new Date();
                const testDate = new Date(this.state.dateTime);
                if(date.getTime()<testDate.getTime()){
                    this.setState({
                        stage : -1
                    })
                }
                else{
                    const compDate = new Date(this.state.dateTime);
                    compDate.setMinutes(compDate.getMinutes()+this.state.duration);
                    console.log(testDate);
                    console.log(this.state.duration);
                    console.log(compDate);
                    if(date.getTime()>compDate.getTime()){
                        this.setState({
                            completeDate : compDate,
                            stage : 1
                        });
                    }
                    else{
                        this.setState({
                            completeDate : compDate,
                            stage : 0
                        });
                    }
                }
            })
            
        }
    }

    render() {
        var date='';
        var compDate='';
        if(this.state.dateTime!=='' && this.state.dateTime!==null)
        {
            date = new Date(this.state.dateTime);
            date = date.toString().split("G")[0];
        }
        if(this.state.completeDate!=='' && this.state.completeDate!==null)
        {
            compDate = new Date(this.state.completeDate);
            compDate = compDate.toString().split("G")[0];
        }
        return (
            <div>
                <h1>Test {localStorage.getItem('testIndex')}</h1>
                <div className="text-center">
                    <label>Attempts Allowed : </label>
                    <span>1</span>
                    <br></br>
                    <label>Time Limit : </label>
                    <span>{this.state.duration} Min</span>
                    <br></br>
                    {this.state.stage==-1 ? 
                    <span>Test will open at {date}</span>:
                    this.state.stage===0 ? <Button onClick={()=>this.props.history.push("/student/attemptTest")}>Attempt Quiz Now</Button> : 
                    <span>Test was closed at {compDate}</span>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(StudentViewTest)
