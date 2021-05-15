import {withRouter} from 'react-router-dom'
import React, { Component } from 'react'
// import { Button } from 'reactstrap'
// import {RadioGroup,Radio} from 'react-radio-group'
import { FormGroup,FormControl,FormLabel,FormCheck,Button } from 'react-bootstrap'
import {Modal,ListGroup,Badge} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
// import './testCreate.css'
// import DateTimePicker from 'react-datetime-picker';
import { Form } from 'reactstrap'

class CreateTest extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             totalMarks : '',
             duration : '',
             date : '',
             courseId : localStorage.getItem('courseId'),
             time : '',
             testType : 'mcqs',
             testName : '',
             dateTime : '',
             addQue : false,
             questions : [
                 {
                     qType : "mcqs",
                     options : [],
                     marks : 1,
                     right : "",
                     desc : ""
                 }
             ]
        }
    }



    handleQuestionChange = (e,index) => {
        const Questions = this.state.questions;
        if(e.target.name==="right"){
            if(Questions[index].qType==="mcqs"){
                Questions[index]={
                    ...Questions[index],
                    [e.target.name] : parseInt(e.target.value.trim())
                }; 
            }
            else if(Questions[index].qType==="checkBox"){
                const right = e.target.value.split(",").map((r,i)=>{
                    return parseInt(r);
                });
                Questions[index]={
                    ...Questions[index],
                    [e.target.name] : right
                }; 
            }
            this.setState({
                ...this.state,
                questions : Questions
            });
        }
        else{
            // console.log(e.target.name + " "+ e.target.value)
            Questions[index]={
                ...Questions[index],
                [e.target.name] : e.target.value
            }; 
            this.setState({
                ...this.state,
                questions : Questions
            });
            // ,()=>console.log(this.state.questions)
        }
    }
    
    addQuestion = (type) => {
        const Questions = this.state.questions;
        if(type==="mcqs"){
            Questions.push({
                qType : "mcqs",
                options : [],
                marks : 1,
                desc : "",
                right : ""
            });
        }
        else if(type==="checkBox"){
            Questions.push({
                qType : "checkBox",
                options : [],
                marks : 1,
                desc : "",
                right : []
            });
        }
        else{
            Questions.push({
                qType : "desc",
                marks : 1,
                desc : "",
            });
        }
        
        // console.log(Questions);
        this.setState({
            ...this.state,
            questions : Questions
        });
        this.closeModal();
    }

    addOption = (index) => {
        const Options = this.state.questions[index].options;
        Options.push({
            desc : "",
        });
        const Questions = this.state.questions;
        Questions[index].options = Options;
        this.setState({
            ...this.state,
            questions : Questions
        }) 
    }

    handleOptionChange = (index,optIndex,e)=>{
        const Questions = this.state.questions;
        Questions[index].options[optIndex].desc = e.target.value;
        // console.log(Questions[index].options)
        this.setState({
            ...this.state,
            questions : Questions
        })         
    }

    handleChange = (e) =>{
        const value = e.target.value;
        // console.log(e.target.value);
        if(e.target.name==='time' || e.target.name==="date"){
            // console.log(value);
            this.setState({
                [e.target.name] : value
            },()=>{
                    // console.log(this.state.time);
                    // console.log(this.state.date);
                    if(this.state.date!=="" && this.state.date!==null && this.state.time!=="" && this.state.time!==null){
                        const datee = this.state.date.split("-");
                        const timee = this.state.time.split(":");
                        // const now = new Date();
                        const d = new Date(datee[0],datee[1]-1,datee[2],timee[0],timee[1]);
                        console.log(d);
                        // console.log(now);
                        if(d==="Invalid Date"){
                            console.log("ok")
                        }
                        // console.log(new Date("2021-06-06T11:15:00.000Z"))
                        this.setState({
                            dateTime : d
                        });
                    }else{
                        this.setState({
                            dateTime : ''
                        });
                    }    
            })
        }else{
            // console.log(value);
            this.setState({
                [e.target.name] : value
            });
        }
    }

    deleteQuestion = (delIndex)=>{
        const questions = this.state.questions.filter((question,index)=>{
                                return delIndex!==index;
                            });
        this.setState({
            questions : questions
        });
    }

    deleteOption = (index,delOptIndex)=>{
        console.log(index,delOptIndex);
        console.log(this.state.questions[index].options)
        const options = this.state.questions[index].options.filter((opt,optIndex)=>{
                                return optIndex!==delOptIndex;
                            });
        console.log(options)
        const Questions = this.state.questions;
        Questions[index].options = options;
        this.setState({
            questions : Questions
        })
    }

    handleSubmit = ()=>{
        var f=0;
        console.log(this.state);
        if(this.state.totalMarks==='' || this.state.duration==='' || this.state.dateTime==="" )
        {
            alert("Fields cannot be empty");
            f=1;
        }
        else if(this.state.testName===""){
            alert("please give a Name to test");
            f=1;
        }
        else{
            const questions = this.state.questions;
            var desc = false;
            for(var i=0;i<this.state.questions.length;i++){
                if(questions[i].qType==="desc"){
                    desc = true;
                }
                if(questions[i].desc===''){
                    alert("question Description cannot be empty");
                    f=1;
                }
                else if((questions[i].qType==="mcqs" || questions[i].qType==="checkBox") && questions[i].options.length===0){
                    alert("please mention options for question "+i);
                    f=1;
                }
                else if(questions[i].qType==="mcqs" && questions[i].right===""){
                    alert("please mention right option for question "+i);
                    f=1;
                }
                else if(questions[i].qType==="checkBox" && questions[i].right.length===0){
                    alert("please mention right options for question "+i);
                    f=1;
                }
                else if(questions[i].marks==="" || questions[i].marks===0){
                    alert("please mention marks for question "+i);
                    f=1;
                }
                else{
                    if(questions[i].qType==="mcqs" || questions[i].qType==="checkBox"){
                        const options = questions[i].options;
                        for(var j=0;j<questions[i].options.length;j++){
                            if(options[j].desc===""){
                                alert("option description cannot be null at question "+i+ " option "+j);
                                f=1;
                            }
                        }
                    }
                }
            }
            console.log(JSON.stringify({
                totalMarks : this.state.totalMarks,
                duration : this.state.duration,
                courseId : this.state.courseId,
                dateTime : this.state.dateTime,
                questions : this.state.questions,
                testName : this.state.testName,
                testType : desc===true?"desc":"mcqs"
            }))
            if(f===0){
                console.log(JSON.stringify({
                    totalMarks : this.state.totalMarks,
                    duration : this.state.duration,
                    courseId : this.state.courseId,
                    dateTime : this.state.dateTime,
                    questions : this.state.questions,
                    testName : this.state.testName,
                    testType : desc===true?"desc":"mcqs"
                }))
                // 'https://online-exam-back.herokuapp.com/teacher/createTest'
                fetch('https://online-exam-back.herokuapp.com/teacher/createTest',{
                    method : 'post',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization : localStorage.getItem('token')    
                    },
                    body : JSON.stringify({
                        totalMarks : this.state.totalMarks,
                        duration : this.state.duration,
                        courseId : this.state.courseId,
                        dateTime : this.state.dateTime,
                        questions : this.state.questions,
                        testName : this.state.testName,
                        testType : desc===true?"desc":"mcqs"
                    }),
                }).then(res=>{
                    console.log(res);
                    return res.json();
                }).then(res=>{
                    console.log(res);
                })
            }
        }
    }

    openModal = ()=>{
        this.setState({
            addQue : true
        })
    }

    closeModal = ()=>{
        this.setState({
            addQue : false
        })
    }

    render() {
        return (
            <div className="m-2 mb-5">

                <Modal show={this.state.addQue} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Question</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <i>Heyy</i> What type of question do you want to add?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={()=>this.addQuestion("mcqs")}>
                            MCQ 
                            <i class="circle icon"></i>
                        </Button>
                        <Button variant="primary" onClick={()=>this.addQuestion("checkBox")}>
                            Check Box 
                            <i class="check square icon"></i>
                        </Button>
                        <Button variant="primary" onClick={()=>this.addQuestion("desc")}>
                            Descriptive
                            <i class="edit icon"></i>
                        </Button>
                    </Modal.Footer>
                </Modal>

                <h2>Create Test</h2>
                    <FormGroup className="form-inline col-12">
                        <FormLabel className="m-1">Test Name</FormLabel>
                        <FormControl
                        className="col-6 m-2"
                        name="testName"
                        value = {this.state.testName}
                        placeholder = "enter test name"
                        onChange={(e)=>this.handleChange(e)}
                        />    
                    </FormGroup >
                <div className="row">
                    <FormGroup className="form-inline col-sm-6 col-md-2">
                        <FormLabel className="m-1">Total Marks</FormLabel>
                        <FormControl
                        className="col-6 m-2"
                        name="totalMarks"
                        value = {this.state.totalMarks}
                        onChange={(e)=>this.handleChange(e)}
                        />    
                    </FormGroup >
                    <FormGroup className="form-inline col-sm-6 col-md-3">
                        <FormLabel className="m-1">Duration</FormLabel>
                        <FormControl
                        className="col-6 m-2"
                        name="duration"
                        value = {this.state.duration}
                        placeholder = "in minutes"
                        onChange={(e)=>this.handleChange(e)}
                        />    
                    </FormGroup >    
                    {/* <FormGroup className="form-inline col-md-5">
                        <FormLabel className="m-1">Schedule At</FormLabel>
                        <DateTimePicker
                          name = "dateTime"
                          onChange={(value)=>{
                              console.log(value);
                              this.setState({
                                  dateTime:value
                              })
                            }}
                          value={this.state.dateTime}
                        />
                    </FormGroup > */}
                    <FormGroup className="form-inline col-sm-6 col-md-4">
                        <FormLabel className="m-1">Date</FormLabel>
                        <FormControl
                        type="date"
                        className="col-6 m-2"
                        name="date"
                        value = {this.state.date}
                        placeholder = ""
                        onChange={(e)=>this.handleChange(e)}
                        />   
                    </FormGroup> 
                    <FormGroup className="form-inline col-sm-6 col-md-3">
                        <FormLabel className="m-1">time</FormLabel>
                        <FormControl
                        type="time"
                        className="col-6 m-2"
                        name="time"
                        value = {this.state.time}
                        placeholder = ""
                        onChange={(e)=>this.handleChange(e)}
                        />   
                    </FormGroup> 
                </div>
                <div className="m-1">
                    {
                        this.state.questions.map((question,index)=>{
                            return (
                                <div className="text-center row">
                                    <div className="col-xm-9 col-sm-9 col-md-10 border border-3 border-dark ml-2 mr-2 mt-2">
                                        <div className="row mt-1">
                                            <FormGroup className="form-inline col-md-9" key={index}>
                                                <FormLabel className="col-xm-2 col-md-1 ml-1">Q{index+1}</FormLabel>
                                                <FormControl
                                                className="col-9 mr-1 mt-1 mb-1"
                                                as="textarea"
                                                rows={3}
                                                name="desc"
                                                width={300}
                                                columns = {200}
                                                value = {question.desc}
                                                placeholder="Description"
                                                onChange={(e)=>this.handleQuestionChange(e,index)}
                                                />
                                                {/* <i className="col-md-1 float-right">{question.marks}M</i> */}
                                            </FormGroup >
                                            <FormGroup className="form-inline col-md-3 float-right">
                                                <FormLabel className="ml-1">Marks</FormLabel>
                                                <FormControl
                                                className="col-4 mr-1"
                                                name="marks"
                                                value = {question.marks}
                                                onChange={(e)=>this.handleQuestionChange(e,index)}
                                                />    
                                            </FormGroup >
                                        </div>  
                                        {/* <i className="trash alternate icon col-1"></i> */}
                                        {question.qType!=="desc"?
                                         <div>
                                            {
                                                question.options.map((opt,optIndex)=>{ return (
                                                    <div key={optIndex} className="row ">
                                                        <FormControl 
                                                        className = "col-md-4 mb-1 ml-5 mr-5"
                                                        name ="desc"
                                                        value = {opt.desc}
                                                        placeholder = "option..."
                                                        onChange = {(e)=>this.handleOptionChange(index,optIndex,e)}
                                                        /> 
                                                        <i className="trash alternate icon red large ml-2 my-auto" 
                                                        data-toggle="tooltip" data-placement="top" 
                                                        title="Delete Option"
                                                        onClick={()=>this.deleteOption(index,optIndex)}></i>
                                                    </div>
                                                    )
                                                })
                                            }
                                            {question.options.length>0?
                                            <FormGroup className="form-inline col-md-6">
                                                <FormLabel className="m-1">Right Option</FormLabel>
                                                <FormControl
                                                type="text"
                                                className="col-lg-6 m-2"
                                                name="right"
                                                //value = {question.right}
                                                placeholder = "index from 0..."
                                                onChange={(e)=>this.handleQuestionChange(e,index)}
                                                /> 
                                            </FormGroup>
                                            :null}
                                            <div className="d-flex flex-row-reverse">
                                                <Button className="mb-2" onClick={()=>{this.addOption(index)}}>Add Option</Button>
                                            </div>
                                        </div>:null}
                                    </div>
                                    {index!==0 || this.state.questions.length!==1?
                                    <i class="trash alternate icon red big ml-2 my-auto" 
                                    data-toggle="tooltip" data-placement="top" title="Delete Question"
                                    onClick={()=>{
                                        console.log("delete question"+index)
                                        this.deleteQuestion(index)}
                                        }></i>
                                    :null}
                                </div>
                            )
                        })
                    }
                    <br></br>
                    <br></br>
                    <Button className="float-right mt-1 mb-3 mr-3" onClick={()=>{this.openModal()}}>Add Question</Button>
                </div>
                <Button className="btn button-primary m-5" onClick={()=>this.handleSubmit()}>Create</Button>
            </div>
        )
    }
}

export default withRouter(CreateTest)
