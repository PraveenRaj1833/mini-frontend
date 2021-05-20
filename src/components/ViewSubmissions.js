import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Button } from 'react-bootstrap';
import Spinner from './Spinner'

class ViewSubmissions extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            totalMarks : '',
            testId : localStorage.getItem('testId'),
            duration : '',
            completeDate : '',
            courseId : localStorage.getItem('courseId'),
            dateTime : '',
            testName : '',
            testType : '',
            loader : true,
            submissions : []
        }
    }

    logout = ()=>{
        //console.log("logout called");
        localStorage.clear();
        this.props.history.push('/');
    }
    
    componentDidMount = ()=>{
        const test = JSON.parse(localStorage.getItem('test'));
        this.setState({
            totalMarks : test.totalMarks,
            testName : test.testName,
            testType : test.testType,
            dateTime : test.dateTime,
            duration : test.duration,
        });
        fetch('https://online-exam-back.herokuapp.com/teacher/getSubmissions',{
            method : 'post',
            headers : {
                'Content-type' : 'application/json',
                Authorization : localStorage.getItem('token')
            },
            body : JSON.stringify({
                testId : localStorage.getItem('testId'),
                courseId : localStorage.getItem('courseId')
            })
        }).then(res=>{
            return res.json();
        }).then(res=>{
            console.log(res);
            if(res.status===200){
                this.setState({
                    submissions : res.result,
                    loader : false
                });
            }
            else if(res.status===402){
                alert("Session expired, Please Login again");
                this.logout();
            }
            else{
                alert(res.msg);
                this.setState({
                    submissions : [],
                    loader : false
                });
            }
        }).catch(err=>{
            console.log(err);
            this.setState({
                submissions : [],
                loader : false
            });
        })
    }

    render() {
        var date = new Date(this.state.dateTime);
        var dt = date.toString().split("G")[0];
        return (
            <div className="m-2">
                {this.state.loader===true?
                <Spinner></Spinner>:
                <div>
                    <h1 className="m-1">{this.state.testName}</h1>
                    {/* <span className="col-xm-12 col-md-6 col-lg-3 m-2">Test Name : <i className="border border-1 p-1">{this.state.testName}</i></span> */}
                        
                    <div className="row m-2 mb-4">
                        <span className="col-xm-12 col-md-6 col-lg-3 m-2">Total Marks : <i className="border border-1 p-1">{this.state.totalMarks}</i></span>
                        <span className="col-xm-12 col-md-6 col-lg-3 m-2">Duration : <i className="border border-1 p-1">{this.state.duration}</i></span>
                        <span className="col-xm-12 col-md-12 col-lg-5 m-2">Scheduled At : <i className="border border-1 p-1">{dt}</i></span>
                    </div>
                    <div>
                        {this.state.submissions.length===0?<h2>No submissions Yet</h2>:
                        <Table  striped bordered hover size="sm" id="users" className="m-2 w-100 table table-striped table-bordered dt-responsive nowrap">
                            <Thead>
                                <Tr>
                                    <Th>Student Id</Th>
                                    <Th>Start Time</Th>
                                    <Th>Finish Time</Th>
                                    <Th>Marks</Th>
                                    <Th>Review</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    this.state.submissions.map((submission,index)=>{
                                        var atDate = new Date(submission.attemptDate);
                                        atDate = atDate.toString().split("G")[0];
                                        var subDate = new Date(submission.submitDate);
                                        subDate = subDate.toString().split("G")[0];
                                        return (
                                            <Tr key={index}>
                                                <Td>{submission.studentId}</Td>
                                                <Td>{atDate}</Td>
                                                <Td>{subDate}</Td>
                                                <Td>{submission.evaluated===true?submission.marks:"--"}</Td>
                                                <Td>
                                                    <Button onClick={()=>{
                                                        localStorage.setItem('studentId',submission.studentId);
                                                        this.props.history.push('/teacher/reviewTest');
                                                    }}>Review</Button>
                                                </Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                        }
                        
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default withRouter(ViewSubmissions)
