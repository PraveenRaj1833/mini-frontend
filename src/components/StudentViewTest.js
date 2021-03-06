import { Button } from 'react-bootstrap'
import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import '../docs/css/viewTest.css'
import Header from './Header'
import Spinner from './Spinner'

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
            attempted : false,
            result : false,
            marks : 0,
            loader : true
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
                            stage : -1,
                            loader : false
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
                                stage : 1,
                                loader : false
                            });
                        }
                        else{
                            this.setState({
                                completeDate : compDate,
                                stage : 0,
                                loader : false
                            });
                        }
                    }
                })
            }
            else if(res.status===400){
                console.log(res.err)
                alert(res.msg);
                this.setState({
                    loader : false
                })
            }
            if(res.status===203){
                this.setState({
                    attempted : true
                });
                const pDate = new Date();
                const compDate = new Date(res.result.dateTime);
                compDate.setMinutes(compDate.getMinutes()+(2*res.result.duration));
                if(pDate.getTime()>=compDate.getTime()){
                    fetch('https://online-exam-back.herokuapp.com/student/getResult',{
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
                        if(res.status===200){
                            if(res.attempt===true){
                                if(res.eval===true){
                                    this.setState({
                                        result : true,
                                        marks : parseInt(res.result.marks),
                                        loader : false
                                    })
                                }
                            }
                            
                        }
                        else{
                            console.log(res.msg);
                            alert(res.msg);
                            this.setState({
                                loader : false
                            })
                        }
                    }).catch(err=>{
                        console.log(err);
                        this.setState({
                            loader : false
                        })
                    })
                }
                
            }
        })
        .catch(err=>{
            this.setState({
                loader : false
            })
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
                {this.state.loader?<Spinner/>:null}
                 <Header/>
                <div id="svt">
                   
                    <div>
                    <br/>
                    <br/>
                        <h1 id="vth1" className="text-center">{this.state.testName}</h1>
                    <br/>
                    <br/>

                        <div id="board" className="text-center">
                            <label>Attempts Allowed : </label>
                            <span>1</span>
                            <br></br>
                            <label>Time Limit : </label>
                            <span>{this.state.duration} Min</span>
                            <br></br>
                            <br/>
                            {this.state.attempted===true?
                                <div>
                                    <h4>You Have already attempted the test<br></br>No More attempts Allowed </h4>
                                    {this.state.result===true?
                                    <div>
                                        <h4>Your Score is {this.state.marks}/{this.state.totalMarks}</h4>
                                        <Button onClick={()=>{
                                            this.props.history.push('/student/review');
                                        }}>Review</Button>
                                    </div>
                                    : <h4>Results will be declared soon</h4>}
                                </div>
                                
                            :
                            this.state.stage==-1 ? 
                            <span>Test will open at {date}</span>:
                            this.state.stage===0 ? <Button onClick={()=>this.props.history.push("/student/attemptTest")}>Attempt Quiz Now</Button> : 
                            <div>
                                <span>Test was closed at {compDate}</span>
                                <br/>
                                <br/>
                                <Button onClick={()=>{
                                            this.props.history.push('/student/review');
                                }}>View Questions</Button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(StudentViewTest)
