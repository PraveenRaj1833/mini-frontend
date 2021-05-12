import {withRouter} from 'react-router-dom'
import React, { Component } from 'react'
import { Button } from 'reactstrap'
// import {RadioGroup,Radio} from 'react-radio-group'
import { FormGroup,FormControl,FormLabel,FormCheck } from 'react-bootstrap'

class EditTest extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            totalMarks : '',
            duration : '',
            date : '',
            courseId : localStorage.getItem('courseId'),
            time : '',
            dateTime : '',
            questions : []
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
                    totalMarks : res.result.totalMarks,
                    dateTime : res.result.dateTime,
                    duration : res.result.duration,
                    courseId : res.result.courseId,
                    questions : res.result.questions
                },()=>{
                    // console.log('done');
                    // console.log(this.state);
                    var i,j;
                    const questions = this.state.questions;
                    for(i=0;i<questions.length;i++){
                        for(j=0;j<questions[i].options.length;j++){
                            if(questions[i].right===questions[i].options[j].optionId){
                                questions[i].right=j;
                                break;
                            }
                        }
                    }
                    this.setState({
                        questions : questions
                    });
                });
            }
            else{
                alert(res.message);
            }
        })
    }

    render() {
        return (
            <div>
                <h1>Edit Test </h1>
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
                                <div className="row text-center">
                                    <div className="col-md-11 border border-3 border-dark ml-2 mr-2 mt-2">
                                        <div className="row">
                                        <FormGroup className="form-inline col-md-11 row" key={index}>
                                            <FormLabel className="m-1">Q{index+1}</FormLabel>
                                            <FormControl
                                            className="col-md-10 m-2"
                                            as="textarea"
                                            rows={3}
                                            name="desc"
                                            width={300}
                                            columns = {200}
                                            value = {question.desc}
                                            placeholder="Description"
                                            onChange={(e)=>this.handleQuestionChange(e,index)}
                                            //   value={product.description}
                                            //   className="col-lg-4 col-md-3 col-sm-3" 
                                            
                                            />
                                            <i className="col-md-1 float-right">{question.marks}M</i>
                                        </FormGroup >
                                        </div>  
                                        {/* <i className="trash alternate icon col-1"></i> */}
                                        {/* <ul className="list-unstyled"> */}
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
                                                value = {question.right}
                                                placeholder = "index from 0..."
                                                onChange={(e)=>this.handleQuestionChange(e,index)}
                                                /> 
                                            </FormGroup>
                                            :null}
                                    <div className="d-flex flex-row-reverse">
                                        <Button className="mb-2" onClick={()=>{this.addOption(index)}}>Add Option</Button>
                                    </div>
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
                    <Button className="float-right mt-1 mb-3 mr-3" onClick={()=>{this.addQuestion()}}>Add Question</Button>
                </div>
                <Button className="btn button-primary m-5" onClick={()=>this.handleSubmit()}>Create</Button>
            </div>
        )
    }
}

export default withRouter(EditTest)
