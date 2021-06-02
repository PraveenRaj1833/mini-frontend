import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {  } from 'reactstrap'
import Spinner from './Spinner'
import { FormGroup,FormControl,FormLabel,FormCheck,Button,Form,Modal } from 'react-bootstrap'

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
            questions : [
                {
                    des:'',
                    qType : '',
                    options:[{
                        desc : '',
                        optionId : ''
                    }]
                }],
            chgAns : false,
            chgIndex : 0,
            loader : true,
            right : ''
        }
    }
    
    componentDidMount = ()=>{
        this.fetchAllQuestions();
    }

    fetchAllQuestions = ()=>{
        this.setState({
            loader : true
        })
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
                    questions : res.result.questions,
                    loader : false
                },()=>{
                    const Questions = this.state.questions.map((question,index)=>{
                        if(question.qType==="desc")
                            return {
                                ...question,
                                options :[]
                            }
                        else
                            return question;
                    });
                    this.setState({
                        questions : Questions
                    },()=>{
                        console.log("woohooo");
                        console.log(this.state.questions);
                    })
                    
                });
            }
            else{
                alert(res.message);
                this.setState({
                    loader : false
                })
            }
        }).catch(err=>{
            console.log(err);
            this.setState({
                loader : false
            })
        })
    }

    handleChange = (e)=>{
        var value = e.target.value;
        const Questions = this.state.questions;
        const index = this.state.chgIndex;
        var right;
        if(e.target.name==="right"){
            if(Questions[index].qType==="mcqs"){
                if(e.target.value!==''){
                    right= parseInt(e.target.value.trim());
                }
                else{
                    right = (e.target.value.trim()); 
                }
            }
            else if(Questions[index].qType==="checkBox"){
                right = e.target.value.split(",").map((r,i)=>{
                    if(Number.isInteger(parseInt(r)))
                        return parseInt(r);
                });
            }
            this.setState({
                right : right
            })
        }
    }

    closeModal = ()=>{
        this.setState({
            chgAns : false,
            right : ''
        });
    }

    openModel = (index)=>{
        this.setState({
            chgIndex : index
        },()=>{
            this.setState({
                chgAns : true
            });
        })
    }

    changeAnswer = ()=>{
        var index=this.state.chgIndex;
        const Questions = this.state.questions;
        const quesn = Questions[index];
        var f=0;
        if(Questions[index].qType==="mcqs"){
            if(this.state.right===""){
                alert("please mention a right answer");
                f=1;
            }
        }
        else{
            if(this.state.right.length===0){
                alert("please mention a right answer");
                f=1;
            }
        }
        if(f===0){
            this.setState({
                loader : true,
                chgAns : false
            });
            console.log(quesn);
            // http://localhost:4000
            // https://online-exam-back.herokuapp.com
            fetch('https://online-exam-back.herokuapp.com/teacher/changeAnswer',{
                method : 'post',
                headers : {
                    'Content-type' : 'application/json',
                    Authorization : localStorage.getItem('token')
                },
                body : JSON.stringify({
                    pquestion : quesn,
                    newRight : this.state.right,
                    testId : this.state.testId
                })
            }).then(res=>{
                return res.json();
            }).then(res=>{
                console.log(res);
                if(res.status===200){
                    console.log("success");
                    alert(res.msg);
                }
                else{
                    console.log("failure");
                    alert(res.msg);
                }
                this.fetchAllQuestions();
                // this.setState({
                //     loader : false
                // })
            }).catch(err=>{
                console.log(err);
                this.setState({
                    loader : false
                })
            })
        }
    }

    render=()=> {
        const date = new Date(this.state.dateTime);
        const pdate = new Date();
        var edit = pdate.getTime()<date.getTime()
        const dt = date.toString().split("G")[0];
        return (
            
            <div className="m-4 mb-5">
                {this.state.loader===true?<Spinner></Spinner>:null}
                <Modal show={this.state.chgAns} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Answer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.questions[this.state.chgIndex].qType==="mcqs" || 
                        this.state.questions[this.state.chgIndex].qType==="checkBox"?
                        <div className="m-2">
                            <i>{this.state.questions[this.state.chgIndex].desc}</i>
                            {
                                this.state.questions[this.state.chgIndex].options.map((option,optIndex)=>{ return (
                                    <div key={optIndex} className="row ">
                                        <Form.Check 
                                            key={optIndex}
                                            type={this.state.questions[this.state.chgIndex].qType==="mcqs"?"radio":"checkbox"}
                                            label={option.desc}
                                            name={"namee"}
                                            // onChange={(e)=>this.handleChange(e,index)}
                                            value={option.optionId}
                                            readOnly
                                        />
                                    </div>
                                    )
                                })
                            }
                            <FormGroup className="form-inline col-12 m-1 mt-2">
                                <FormLabel className="m-1">Right Option</FormLabel>
                                <FormControl
                                type="text"
                                className="col-lg-6 m-2"
                                name="right"
                                value = {this.state.right}
                                placeholder = "index from 0..."
                                onChange={(e)=>this.handleChange(e)}
                                /> 
                            </FormGroup>
                        </div>:"Not an mcq or checkbox question"}
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.closeModal()}>Cancel</Button>
                        <Button variant="primary" onClick={()=>this.changeAnswer()}>Update</Button>
                    </Modal.Footer>
                </Modal>
                {edit===true?
                <Button className="btn btn-light text-primary float-right m-2 mr-5" 
                onClick={()=>{this.props.history.push('/teacher/editTest');}}>Edit &nbsp; 
                <svg className="m-1 p-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="blue" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
                </Button> : null}
                <h1 className="text-center">{this.state.testName}</h1>
                {/* <span className="col-xm-12 col-md-6 col-lg-3 m-2">Test Name : <i className="border border-1 p-1">{this.state.testName}</i></span> */}
                    
                <div className="row m-2 mb-4">
                    <span className="col-xs-12 col-md-6 col-lg-3 m-2">Total Marks : <i className="border border-1 p-1">{this.state.totalMarks}</i></span>
                    <span className="col-xs-12 col-md-6 col-lg-3 m-2">Duration : <i className="border border-1 p-1">{this.state.duration}</i></span>
                    <span className="col-xs-12 col-md-12 col-lg-5 m-2">Scheduled At : <i className="border border-1 p-1">{dt}</i></span>
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
                                    {edit===false?<i class="ui pen square icon big blue float-right" title="click to edit right option"
                                    onClick={()=>this.openModel(index)}></i>:null}
                                    
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
                                        {edit===false?<i class="ui pen square icon big blue float-right" title="click to edit right option"
                                        onClick={()=>this.openModel(index)}></i>:null}
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
