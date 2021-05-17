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
            stage : -1,
            testName : '',
            testType : '',
            attempted : false
            //questions : []
        }
    }

    componentDidMount =()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        fetch('https://online-exam-back.herokuapp.com/student/getTestDetails',{
            method : 'post',
            body : JSON.stringify({
                testId : localStorage.getItem("testId"),
                studentId : user.studentId
            }),
            headers : {
                'Content-type' : 'application/json',
                Authorization : localStorage.getItem('token')
            }
        }).then(res=>{
            return res.json();
        }).then(res=>{
            console.log(res);
            if(res.status===200 || res.status===203){
                this.setState({
                    totalMarks : res.result.totalMarks,
                    duration : res.result.duration,
                    dateTime : res.result.dateTime,
                    testName : res.result.testName,
                    testType : res.result.testType,
                    testId : res.result.testId,
                    courseId : res.result.courseId
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
            else if(res.status===400){
                console.log(res.err)
                alert(res.msg);
            }
            if(res.status===203){
                this.setState({
                    attempted : true
                });
            }
        })
        .catch(err=>{
            console.log(err);
        })
        // const test = JSON.parse(localStorage.getItem('test'))
        // if(test!==null){
              
        // }
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
                <h1>{this.state.testName}</h1>
                <div className="text-center">
                    <label>Attempts Allowed : </label>
                    <span>1</span>
                    <br></br>
                    <label>Time Limit : </label>
                    <span>{this.state.duration} Min</span>
                    <br></br>

                    {this.state.attempted===true?
                        <h4>You Have already attempted the test<br></br>No More attempts Allowed </h4>
                    :
                    this.state.stage==-1 ? 
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
