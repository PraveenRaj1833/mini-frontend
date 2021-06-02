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
import '../docs/css/dashboard.css'
import Header from './Header';

export class TeacherDashboard extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
            user : JSON.parse(localStorage.getItem('user')),
            courses : [],
            // time : {},
            // seconds : 200
        }
    }

    logout = ()=>{
        console.log("logout called");
        localStorage.clear();
        this.props.history.push('/');
    }

    componentDidMount(){
    
        console.log(localStorage.getItem('user'))
        fetch('https://online-exam-back.herokuapp.com/teacher/getCourses',{
            method : 'post',
            body : JSON.stringify({
                teacherId : this.state.user.teacherId
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
                <Prompt message={(location,action)=>{
                        return location.pathname==='/login'?"Do you want to logout?":true;
                    }}></Prompt>
                
                <Header/>

                <div id="tdpic">
                    <div id="tdc">
                    <h1>Courses</h1>
                    <br/>
                <ul>
                    {this.state.courses.map((course,index)=>{
                        return <li className="mask rgba-red-strong course col-xl-5 col-lg-5 col-sm-8 col-10 my-auto" 
                        onClick={()=>{
                            localStorage.setItem('courseId',course.courseId)
                            this.props.history.push("/teacher/course");
                        }}><h3 className="course">{course.courseId}</h3>
                        <br/>
                        </li>
                        //return <li><a href="/course">{course.courseName} </a></li>
                    })}
                </ul>
                </div>
                {/* <Button className="m-1" onClick={()=>this.props.history.push('/teacher/ViewProfile')}>View Profile</Button> */}
            </div>
            </div>
        )
    }
}

export default withRouter(TeacherDashboard)
