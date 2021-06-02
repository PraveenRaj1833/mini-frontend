import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Button } from 'react-bootstrap';
import Spinner from './Spinner'
import '../docs/css/review.css'
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
            submissions : [],
            displaySubmissions : [],
            searchBy : 'studentId',
            sortAsc : true
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
                const sub = res.result;
                this.setState({
                    submissions : res.result,
                    displaySubmissions : [...sub],
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

    sortByColumn = (colName) =>{
        if(this.state.sortAsc==false)
            colName='-'+colName;
        this.setState({
          ...this.state,
          sortAsc:!this.state.sortAsc,
          displaySubmissions : this.state.displaySubmissions.sort(this.dynamicSort(colName))
        })
    }

    dynamicSort=(property)=> {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property].toString().toLowerCase() < b[property].toString().toLowerCase()) ? -1 : (a[property].toString().toLowerCase() > b[property].toString().toLowerCase()) ? 1 : 0;
            return result * sortOrder;
        }
    }

    filterSearch = (text)=>
    {
        return this.state.submissions.filter((submission,index)=>{
            return submission[this.state.searchBy].toString().toLowerCase().includes(text);
        })
    }

    handleSearch = (event)=>
    {
        // console.log(event.target.value);
        var text=event.target.value.toLowerCase();
        this.setState({
            ...this.state,
            displaySubmissions:this.filterSearch(text)
        })
    }


    handleChange = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
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
                    <br/>
                    <h1 id="vsh1" className="m-1 text-center">{this.state.testName}</h1>
                    <br/>
                    {/* <span className="col-xm-12 col-md-6 col-lg-3 m-2">Test Name : <i className="border border-1 p-1">{this.state.testName}</i></span> */}
                        
                    <div className="row m-2 mb-4">
                        <span className="col-xm-12 col-md-6 col-lg-3 m-2">Total Marks : <i className="border border-1 p-1">{this.state.totalMarks}</i></span>
                        <span className="col-xm-12 col-md-6 col-lg-3 m-2">Duration : <i className="border border-1 p-1">{this.state.duration}</i></span>
                        <span className="col-xm-12 col-md-12 col-lg-5 m-2">Scheduled At : <i className="border border-1 p-1">{dt}</i></span>
                    </div>
                    <input className=" mt-2 float-right mr-2" name="searchText" id="searchText" 
                        placeholder={`search By ${this.state.searchBy}`}
                        onChange={(event)=>this.handleSearch(event)}></input>
                    <i class="search icon float-right pt-2 "></i> 
                    <select className="mt-2 float-right mr-2" name="searchBy" onChange={(event)=>this.handleChange(event)}>
                        <option value="studentId">Student Id</option>
                        <option value="marks">Marks</option>
                    </select>
                    <br></br>
                    <br/>
                    <div>
                        {this.state.submissions.length===0?<h2 className="text-center">No submissions Yet</h2>:
                        this.state.displaySubmissions.length===0?<h3 className="text-center">No Match Found</h3>:
                        <Table  striped bordered hover size="sm" id="users" className="m-2 w-100 table table-striped table-bordered dt-responsive nowrap">
                            <Thead>
                                <Tr>
                                    <Th onClick={()=>this.sortByColumn("studentId")}>Student Id</Th>
                                    <Th onClick={()=>this.sortByColumn("attemptDate")}>Start Time</Th>
                                    <Th onClick={()=>this.sortByColumn("submitDate")}>Finish Time</Th>
                                    <Th onClick={()=>this.sortByColumn("marks")}>Marks</Th>
                                    <Th>Review</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    this.state.displaySubmissions.map((submission,index)=>{
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
