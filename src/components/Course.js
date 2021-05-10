import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {
  Container,
  Row,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Modal
} from 'react-bootstrap';

export class Course extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             course : {},
             tests : [{}]
        }
    }
    
    componentDidMount = ()=>{
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
            console.log(res);
            if(res.status==200){
                this.setState({
                    course : res.result
                });
                fetch('https://online-exam-back.herokuapp.com/teacher/getTests',{
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
                    console.log(res1);
                    if(res1.status==200){
                        this.setState({
                            tests : res1.results
                        })
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }
        }).catch(err1=>{
            console.log(err1);
        })
    }

    render() {
        return (
            <div>
                <h1>{this.state.course.courseName} </h1>
                <Button className="float-right" onClick={()=>{
                    this.props.history.push('/teacher/createTest');
                }}>Create Test</Button>
                <br></br>
                <div className="m-4">
                    <Row>
                        <Table  striped bordered hover size="sm" id="users" className="m-2 w-100 table table-striped table-bordered dt-responsive nowrap">
                            <Tbody>
                            {
                                this.state.tests.map((test,index)=>{
                                    const date = new Date(test.dateTime);
                                    const dt = date.toString().split("G")[0]
                                    console.log(new Date(test.dateTime))
                                    return (
                                        <Tr key={test.testId}>
                                            <Td>{`Test ${index}`}</Td>
                                            <Td>{dt}</Td>
                                            <Td>{test.duration}</Td>
                                            <Td>{test.totalMarks}</Td>
                                            <Td className="text-center">
                                            <span
                                                variant="info"
                                                onClick={() =>
                                                // this.props.history.push ('/users/create', {update: true,  user,})
                                                {
                                                    localStorage.setItem('update',true);
                                                    //this.props.history.push({pathname:"/users/create"})
                                                    alert("Edit test "+(index))
                                                }
                                                }
                                                
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="blue" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                                </svg>
                                            </span>
                                            </Td>
                                            <Td>
                                            <span
                                                variant="danger"
                                                onClick={() => {
                                                if(window.confirm("Do you want to really delete this Test")==true)
                                                {
                                                    
                                                    alert(`Deleted test ${index} successfully`)
                                                }
                                                }
                                                }
                                            
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                </svg>
                                            </span>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </Row>
                </div>
            </div>
        )
    }
}

export default withRouter(Course)
