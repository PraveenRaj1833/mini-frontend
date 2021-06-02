// import { json } from 'express'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import {Carousel,Navbar,Nav,NavDropdown,OverlayTrigger,Popover} from 'react-bootstrap'
import {
    Container,
    Row,
    Form,
    FormGroup,
    FormControl,
    FormLabel,
    Alert
  } from 'react-bootstrap';
import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import {withRouter,Prompt} from 'react-router-dom'
// import WebcamStreamCapture from './WebcamStreamCapture';
import Header from './Header';

export class Dashboard extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
            user : JSON.parse(localStorage.getItem('user')),
            courses : [],
        }
    }

    logout = ()=>{
        //console.log("logout called");
        localStorage.clear();
        this.props.history.push('/');
    }

    componentDidMount(){
        console.log(localStorage.getItem('user'))
        fetch('https://online-exam-back.herokuapp.com/student/getCourses',{
            method : 'post',
            body : JSON.stringify({
                studentId : this.state.user.studentId
            }),
            headers : {
                'Content-type' : 'application/json',
                Authorization : localStorage.getItem('token')
            }
        }).then(res => {
            return res.json();
        }).then(res => {
            console.log(res)
            if(res.status == 200){
                this.setState({
                    courses : res.results
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }

    
    render() {
        
        return (
            <div>
                <Header/>
                <Prompt message={(location,action)=>{
                        return location.pathname==='/login'?"Do you want to logout?":true;
                    }}></Prompt>
                
            <div id="dpic">
                <div id="dc">

                <h1>Courses</h1>
                <br/>
                {/* <WebcamStreamCapture></WebcamStreamCapture> */}
                
                <ul>
                    {this.state.courses.map((course,index)=>{
                        return <li className="mask rgba-red-strong  course col-xl-5 col-lg-5 col-sm-8 col-10 my-auto" key={index}
                        onClick={()=>{
                            localStorage.setItem('courseId',course.courseId);
                            this.props.history.push("/student/course");
                        }}><h2>{course.courseName}</h2>
                        <br/>
                        </li>
                        //return <li><a href="/course">{course.courseName} </a></li>
                    })}
                </ul>
                
                </div>
                {/* <Button className="m-1" onClick={()=>this.props.history.push('/student/ViewProfile')}>View Profile</Button> */}
            </div>
            </div>
        )
    }
}

export default withRouter(Dashboard)
