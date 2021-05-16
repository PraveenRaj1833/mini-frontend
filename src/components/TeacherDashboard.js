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
                <div className="home-header-section p-2">
                       { 
                       (localStorage.getItem('token'))?<span>
                        <OverlayTrigger
                            trigger="hover"
                            placement="bottom"
                            overlay={
                                <Popover>
                                <Popover.Title as="h3"><strong>{this.state.name}</strong></Popover.Title>
                                <Popover.Content>
                                    <Table>
                                        <Tr>
                                            <Th>Email</Th>
                                            <Td>:{this.state.email}</Td>
                                        </Tr>
                                        <Tr>
                                            <Th>Role</Th>
                                            <Td>:Admin</Td>
                                        </Tr>
                                    </Table>
                                </Popover.Content>
                                </Popover>
                            }
                            >
                            {/* <Button variant="secondary">Popover on {placement}</Button> */}
                            <button className="float-right mr-2 mt-1 inline btn btn-success border border-1" >
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>{this.state.name}</button>
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
                        <span className="inline set-headings">Online </span>
                        <h3 id="head-of-a1" className="mt-1">Examination</h3>
                    </div>
                <h1>Courses</h1>
                <ul>
                    {this.state.courses.map((course,index)=>{
                        return <li className="mask rgba-red-strong text-primary course" 
                        onClick={()=>{
                            localStorage.setItem('courseId',course.courseId)
                            this.props.history.push("/teacher/course");
                        }}>{course.courseId}
                        </li>
                        //return <li><a href="/course">{course.courseName} </a></li>
                    })}
                </ul>
                <Button className="m-1" onClick={()=>this.props.history.push('/teacher/ViewProfile')}>View Profile</Button>
            </div>
        )
    }
}

export default withRouter(TeacherDashboard)
