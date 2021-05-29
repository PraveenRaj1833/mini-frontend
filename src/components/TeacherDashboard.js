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
        const user = JSON.parse(localStorage.getItem('user'));
        const popover = (
            <Popover id="popover-basic">
              <Popover.Title as="h3">{localStorage.getItem("role")==="student"?"Student":"Teacher"} Details</Popover.Title>
              <Popover.Content>
                <b className="h5">{user.teacherId}</b> <br/>
                {user.name} <br/>
                <Button onClick={()=>this.props.history.push("/teacher/ViewProfile")} className="w-100 m-1">View Profile</Button>
                <Button onClick={()=>this.props.history.push("/teacher/updateProfile")} className="w-100 m-1">Edit Profile</Button>
                <Button onClick={()=>this.props.history.push("/teacher/updateTeacherPassword")} className="w-100 m-1"> Edit Password </Button>
              </Popover.Content>
            </Popover>
          );
        return (
            <div>
                <Prompt message={(location,action)=>{
                        return location.pathname==='/login'?"Do you want to logout?":true;
                    }}></Prompt>
                <div id="dh" className="home-header-section">
                       { 
                       (localStorage.getItem('token'))?<span>
                        <OverlayTrigger trigger="click" placement="bottom" className="float-right inline mt-1 mr-2 border border-1" overlay={popover}>
                            <Button variant="success" className="float-right inline mt-1 mr-2 border border-1"><i class="user icon"></i></Button>
                        </OverlayTrigger>
    
                        <button className="float-right mr-2 mt-1 inline btn btn-success border border-1 green" onClick={this.logout}>Logout</button>
                        <button className="small ui icon button float-right mr-2 btn-success notify mt-1 border border-1" width="20" height="20">
                            <i className="bell icon " ></i>
                        </button>
                        </span>:
                        <span>
                            <button className="float-right mr-2 mt-1 inline btn btn-success border border-1" onClick={()=>this.props.history.push('/register')}>Register</button>
                            <button className="float-right mr-2 mt-1 inline btn btn-success border border-1" onClick={()=>this.props.history.push('/login')}>Login</button>
                        </span>
                        }
                        <span className="inline set-headings">Online Examination</span>
                        
                        {/* <h3 id="head-of-a1" className="mt-1">Examination</h3> */}
                    </div>

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
