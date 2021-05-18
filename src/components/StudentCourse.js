import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import Spinner from './Spinner'

class StudentCourse extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             course : {},
             tests : [{}],
             loader : true
        }
    }
    
    logout = ()=>{
        //console.log("logout called");
        localStorage.clear();
        this.props.history.push('/');
    }

    componentDidMount = ()=>{
        console.log(localStorage.getItem("courseId"));
        fetch('https://online-exam-back.herokuapp.com/course/getById',{
            method : 'post',
            headers : {
                'Content-type' : 'application/json',
                Authorization : localStorage.getItem('token')
            },
            body : JSON.stringify({
                courseId : localStorage.getItem('courseId')
            })
        }).then(res=>{
            return res.json();
        }).then(res=>{
            console.log("course");
            console.log(res);
            if(res.status==200){
                this.setState({
                    course : res.result
                });
                // 'https://online-exam-back.herokuapp.com'
                fetch('https://online-exam-back.herokuapp.com/student/getTests',{
                    method : 'post',
                    headers : {
                        'Content-type' : 'application/json',
                         Authorization : localStorage.getItem('token')
                    },
                    body : JSON.stringify({
                        courseId : localStorage.getItem('courseId')
                    })
                }).then(res1=>{
                    return res1.json();
                }).then(res1=>{
                    console.log("tests");
                    console.log(res1);
                    if(res1.status==200){
                        this.setState({
                            tests : res1.results,
                            loader : false
                        })
                    }
                    else if(res.status===402){
                        this.setState({
                            loader : false
                        })
                        alert("Session Expired, please login again");
                        this.logout();
                    }
                }).catch(err=>{
                    this.setState({
                        loader : false
                    })
                    console.log(err);
                })
            }
        }).catch(err1=>{
            this.setState({
                loader : false
            })
            console.log(err1);
        })
    }

    render() {
        return (
            <div className="m-4">
                {this.state.loader===true?<Spinner></Spinner>:null}
                <h1 className="m-5">{this.state.course.courseName} </h1>
                <ul>
                    {this.state.tests.map((test,index)=>{
                        const date = new Date(test.dateTime);
                        return (
                            <li className="mask rgba-red-strong text-primary test m-1" 
                                onClick={()=>{
                                    localStorage.setItem('testId',test.testId);
                                    localStorage.setItem('testIndex',index+1);
                                    localStorage.setItem('test',JSON.stringify(test));
                                    this.props.history.push("/student/viewTest");
                                }}>{test.testName} &nbsp; -
                                <i className="ml-5">{date.toString()}</i>
                            </li>
                        )
                    })}
                </ul>
                
            </div>
        )
    }
}

export default withRouter(StudentCourse)
