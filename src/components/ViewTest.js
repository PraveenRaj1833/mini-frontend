import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Button } from 'reactstrap'
import { FormGroup,FormControl,FormLabel,FormCheck } from 'react-bootstrap'

class ViewTest extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            totalMarks : '',
            duration : '',
            date : '',
            courseId : localStorage.getItem('courseId'),
            time : '',
            dateTime : '',
            questions : [{}]
        }
    }
    
    componentDidMount = ()=>{
        fetch('https://online-exam-back.herokuapp.com/teacher/getTestDetails',{
            method : 'post',
            headers : {
                'Content-type' : 'application/json',
                Authorization : localStorage.getItem('token')
            },
            body : JSON.stringify({
                testId : localStorage.getItem('testId')
            })
        }).then(res=>{
            return res.json();
        }).then(res=>{
            console.log(res);
            console.log(res.result.questions);
            if(res.status==200){
                console.log("success")
                this.setState({
                    testId : res.result.testId,
                    testType : res.result.testType,
                    testName : res.result.testName,
                    totalMarks : res.result.totalMarks,
                    dateTime : res.result.dateTime,
                    duration : res.result.duration,
                    courseId : res.result.courseId,
                    questions : res.result.questions
                },()=>{
                    console.log('done');
                    console.log(this.state);
                });
            }
            else{
                alert(res.message);
            }
        })
    }

    render=()=> {
        const date = new Date(this.state.dateTime);
        const dt = date.toString().split("G")[0];
        return (
            
            <div className="m-4 mb-5">
                <Button className="btn btn-light text-primary float-right m-2 mr-5" 
                onClick={()=>{this.props.history.push('/teacher/editTest');}}>Edit &nbsp; 
                <svg className="m-1 p-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="blue" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
                </Button>
                <h1>{this.state.testName}</h1>
                {/* <span className="col-xm-12 col-md-6 col-lg-3 m-2">Test Name : <i className="border border-1 p-1">{this.state.testName}</i></span> */}
                    
                <div className="row m-2 mb-4">
                    <span className="col-xm-12 col-md-6 col-lg-3 m-2">Total Marks : <i className="border border-1 p-1">{this.state.totalMarks}</i></span>
                    <span className="col-xm-12 col-md-6 col-lg-3 m-2">Duration : <i className="border border-1 p-1">{this.state.duration}</i></span>
                    <span className="col-xm-12 col-md-12 col-lg-5 m-2">Scheduled At : <i className="border border-1 p-1">{dt}</i></span>
                    {/* <span>Total Marks : <i className="border border-1">{this.state.totalMarks}</i></span> */}
                </div>
                {
                this.state.questions.map((question,index)=>{
                    return (
                        <div className="border border-3 m-2">
                             <div className="row">
                                <FormGroup className="form-inline col-md-11" key={index}>
                                    <FormLabel className="m-1">Q{index+1}</FormLabel>
                                    <FormControl
                                    className="col-xm-12 col-md-9 m-2"
                                    as="textarea"
                                    readOnly
                                    rows={3}
                                    name="desc"
                                    width={300}
                                    columns = {200}
                                    value = {question.desc}
                                    //placeholder="Description"
                                    //onChange={(e)=>this.handleQuestionChange(e,index)}
                                    />
                                    <i className="col-md-1 float-right">{question.marks}M</i>
                                </FormGroup >
                            </div>
                            {
                                question.qType==="mcqs"?
                                <div>
                                    {question.options.map((option,optIndex)=>{
                                        return (
                                            <div key={optIndex} className="ml-5">
                                                <label>
                                                    <input type="radio" value={option.optionId} readOnly
                                                        checked={option.optionId===question.right} className="p-1"/>
                                                    &nbsp;{option.desc}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                                :question.qType==="checkBox"?
                                    <div>
                                        {question.options.map((option,optIndex)=>{
                                            return (
                                                <div key={optIndex} className="ml-5">
                                                    <label>
                                                        <input type="checkbox" value={option.optionId} readOnly
                                                            checked={question.right.includes(option.optionId)} className="p-1"/>
                                                        &nbsp;{option.desc}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                :null
                            }
            
                        </div>
                    )
                })
                }
                <br></br>
            </div>
        )
    }
}

export default withRouter(ViewTest)
