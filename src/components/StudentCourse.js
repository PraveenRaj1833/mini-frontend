import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Spinner from './Spinner'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../docs/css/review.css'

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
                    else if(res.status==402){
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
        const user = JSON.parse(localStorage.getItem('user'));
        const popover = (
            <Popover id="popover-basic">
              <Popover.Title as="h3">{localStorage.getItem("role")==="student"?"Student":"Teacher"} Details</Popover.Title>
              <Popover.Content>
                <b className="h5">{user.studentId}</b> <br/>
                {user.name} <br/>
                <Button onClick={()=>this.props.history.push("/student/ViewProfile")} className="w-100 m-1">View Profile</Button>
                <Button onClick={()=>this.props.history.push("/student/updateProfile")} className="w-100 m-1">Edit Profile</Button>
                <Button onClick={()=>this.props.history.push("/student/updatePassword")} className="w-100 m-1"> Edit Password </Button>
              </Popover.Content>
            </Popover>
          );
          
        return (
            <div id="str" className="m-1 ml-2">
                
                {this.state.loader===true?<Spinner></Spinner>:null}
                <br/>
                <h1 id="sch1" className=" text-center">{this.state.course.courseName} </h1>
                <br/>
                <div id="tablepad">
                    <Table  striped bordered hover size="sm" id="users" className="m-3 w-100 table table-striped table-bordered dt-responsive nowrap">
                        <Thead>
                            <Tr>
                                <Th>Test Name</Th>
                                <Th>Scheduled At</Th>
                                <Th>Attempt/View Test</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        {this.state.tests.map((test,index)=>{

                            const date = new Date(test.dateTime);
                            const dt = date.toString().split("G")[0]
                            console.log(new Date(test.dateTime))
                            return (
                                <Tr key={test.testId}>
                                        <Td>{test.testName}</Td>
                                        <Td>{dt}</Td>
                                        <Td className="text-center"><button className="btn btn-secondary " onClick={()=>{
                                            localStorage.setItem('testId',test.testId);
                                            localStorage.setItem('testIndex',index+1);
                                            localStorage.setItem('test',JSON.stringify(test));
                                            this.props.history.push("/student/viewTest");
                                        }}>View Test</button></Td>
                                </Tr>        
                            )
                        })}
                        </Tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default withRouter(StudentCourse)
