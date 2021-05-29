import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { FormGroup,FormControl,FormLabel,FormCheck,Form,Row,Jumbotron,Container, Button } from 'react-bootstrap'
import '../docs/css/review.css'
import Spinner from './Spinner';

class StudentReview extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            totalMarks : '',
            studentId : localStorage.getItem('userId'),
            testId : localStorage.getItem('testId'),
            duration : '',
            completeDate : '',
            courseId : localStorage.getItem('courseId'),
            time : {},
            dateTime : '',
            //stage : -1,
            testName : '',
            testType : '',
            attemped : false,
            questions : [{}],
            answers : [{}],
            marks : '',
            attemped : true,
            attemptDate : null,
            submitDate : null,
            // seconds : 300,
            // showSubmitModel : false,
            loader : true
        }
    }
    
    componentDidMount = ()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        // http://localhost:4000
        // https://online-exam-back.herokuapp.com
        fetch('https://online-exam-back.herokuapp.com/student/reviewTest',{
            method : 'post',
            body : JSON.stringify({
                testId : localStorage.getItem("testId"),
                studentId : user.studentId
            }),
            headers : {
                'Content-type' : 'application/json',
                Authorization : localStorage.getItem('token')
            }
        }).then(res=>{
            return res.json();
        }).then(res=>{
            console.log(res);
            if(res.status===200){
                console.log("hahaha");
                this.setState({
                    testId : res.result.testId,
                    totalMarks : parseInt(res.result.totalMarks),
                    dateTime : res.result.dateTime,
                    duration : res.result.duration,
                    courseId : res.result.courseId,
                    testName : res.result.testName,
                    testType : res.result.testType,
                    questions : res.result.questions,
                    answers : res.result.answers,
                    marks : parseInt(res.result.marks),
                    attemped : res.result.attempt,
                    attemptDate : res.result.attemptDate,
                    submitDate : res.result.submitDate,
                    loader : false
                },()=>{
                    console.log("state");
                    console.log(this.state);
                })
            }
            else{
                this.setState({
                    loader : false
                })
                alert(res.msg);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    render() {
        const date = new Date(this.state.dateTime);
        const dt = date.toString().split("G")[0];
        var atDate;
        if(this.state.attemptDate!==null && this.state.attemptDate!==''){
            atDate = new Date(this.state.attemptDate);
            atDate = atDate.toString().split("G")[0];
        }
        var sDate;
        if(this.state.submitDate!==null && this.state.submitDate!==''){
            sDate = new Date(this.state.submitDate);
            sDate = sDate.toString().split("G")[0];
        }
        return (
            <div id="str" className="m-3">
                {this.state.loader===true?<Spinner></Spinner>:null}
                <br/>
                <h1 id="reh1" className="text-center">{this.state.testName}</h1>
                <br/>
                <div className="border border-4">
                    <table>
                        <tr>
                            <th className="w-45">Conducted On </th>
                            <td className="w-50">{dt}</td>
                        </tr>
                        <tr>
                            <th>Start Time </th>
                            <td>{atDate}</td>
                        </tr>
                        <tr>
                            <th>Finish Time </th>
                            <td>{sDate}</td>
                        </tr>
                        <tr>
                            <th>State </th>
                            <td>{this.state.attemped===true?"Finished":"Not Attempted"}</td>
                        </tr>
                        <tr>
                            <th>Score</th>
                            <td>{this.state.marks} out of {this.state.totalMarks} &nbsp; ({(this.state.marks/this.state.totalMarks)*100}%)</td>
                        </tr>
                    </table>
                </div>
                <div>
                    {
                        this.state.questions.map((question,index)=>{
                            var rightCount=0;
                            var wrongCount=0;
                            var correctOne = "";
                            var correctAns = [];
                            return (
                            <div className="mt-2 mb-2 ml-2 mr-1 border border-3">
                                    <div className="row">
                                        <FormGroup className="form-inline col-xm-12 col-sm-12 col-md-11 col-lg-11 col-xl-11" key={index}>
                                            <FormLabel className="mt-1 ml-1">Q{index+1}</FormLabel>
                                            <FormControl
                                            className="col-xm-10 col-sm-10 col-md-9 col-lg-9 col-xl-9 ml-1 mr-2 mt-2 mb-2"
                                            as="textarea"
                                            readOnly
                                            rows={3}
                                            name="desc"
                                            width={300}
                                            columns = {200}
                                            value = {question.desc}
                                            />
                                            <i className="col-sm-2 col-md-1 float-right">{question.marks}M</i>
                                        </FormGroup >
                                    </div>
                                    <div>
                                    {
                                        question.qType==="mcqs"?
                                        <FormGroup className=" ml-5 text-left">
                                            {/* <FormLabel id="label1">Gender</FormLabel> */}
                                            <fieldset >
                                            <Form.Group className="options input">
                                                {question.options.map((option,optIndex)=>{
                                                    const namee="question"+index;
                                                    const checked = option.optionId===parseInt(this.state.answers[index].optionId);
                                                    var correct; 
                                                    if(option.optionId===question.right)
                                                        correctOne = option.desc;
                                                    if(checked===true){
                                                        if(option.optionId===question.right){
                                                            correct = true;
                                                            rightCount+=1;
                                                        }    
                                                        else{
                                                            correct = false;    
                                                            wrongCount+=1;
                                                        }
                                                    }    
                                                    return (
                                                        <div key={optIndex} className="">
                                                            <label>
                                                                <input type="radio" value={option.optionId} readOnly name={namee}
                                                                    checked={checked} className="p-1"/>
                                                                &nbsp;{option.desc}&nbsp; 
                                                                {
                                                                    checked===true?
                                                                    (correct===true?
                                                                    <i class="check icon green"></i>:
                                                                    <i class="x icon red"></i>)
                                                                    :null
                                                                }
                                                            </label>
                                                        </div>
                                                    )
                                                })}
                                            </Form.Group>
                                            </fieldset>
                                            <div className={rightCount===0?(wrongCount===0?"unattempted p-2 mr-2":"wrong p-2 mr-2"):"right p-2 mr-2"}>
                                                {rightCount===0?(wrongCount===0?
                                                <div>
                                                    {this.state.attemped===true?
                                                    <p>You Have Not attempted this question</p>:null}
                                                    <p>The Correct Answer is <b>{correctOne}</b></p>
                                                </div>:
                                                <div>
                                                    <p>Your answer is incorrect</p>
                                                    <p>The Correct Answer is <b>{correctOne}</b></p>
                                                </div>):
                                                <div>
                                                    <p>Your Answer is Correct</p>
                                                    <p>The Answer is <b>{correctOne}</b></p>
                                                </div>
                                                }
                                            </div>
                                        </FormGroup>
                                        : question.qType==="checkBox"?
                                            <FormGroup className=" ml-5 text-left">
                                                {/* <FormLabel id="label1">Gender</FormLabel> */}
                                                <fieldset >
                                                <Form.Group className="options input">
                                                    {question.options.map((option,optIndex)=>{
                                                        const namee="question"+index;
                                                        const checked = this.state.answers[index].options.includes(option.optionId);
                                                        var correct; 
                                                        if(question.right.includes(option.optionId))
                                                            correctAns.push(option.desc);
                                                        if(checked===true){
                                                            if(question.right.includes(parseInt(option.optionId)))
                                                             {
                                                                correct = true;
                                                                rightCount+=1;
                                                             }   
                                                            else
                                                            {
                                                                correct = false;
                                                                wrongCount+=1;
                                                            }    
                                                        }    
                                                        return (
                                                            <div key={optIndex} className="">
                                                                <label>
                                                                    <input type="checkbox" value={option.optionId} readOnly name={namee}
                                                                        checked={checked} className="p-1"/>
                                                                    &nbsp;{option.desc}&nbsp; 
                                                                    {
                                                                        checked===true?
                                                                        (correct===true?
                                                                        <i class="check icon green"></i>:
                                                                        <i class="x icon red"></i>)
                                                                        :null
                                                                    }
                                                                </label>
                                                            </div>
                                                        )
                                                    })}
                                                </Form.Group>
                                                </fieldset>
                                                <br></br>
                                                <div className={rightCount===question.right.length?(wrongCount===0?"right p-2 mr-2":"wrong p-2 mr-2")
                                                            :(rightCount===0 && wrongCount===0?"unattempted p-2 mr-2":"wrong p-2 mr-2")}>
                                                    {rightCount===question.right.length?(wrongCount===0?
                                                     <div>
                                                        <p>Your Answer is Correct</p>
                                                        <p>The Answers are {correctAns.map((ans,ansIndex)=>{
                                                            if(ansIndex!==correctAns.length-1)
                                                                return <b>{ans} , </b>
                                                            else
                                                                return <b>{ans}</b>
                                                        })}</p>
                                                    </div>:
                                                    <div>
                                                        <p>Your answer is incorrect</p>
                                                        <p>The Correct Answers are {correctAns.map((ans,ansIndex)=>{
                                                            if(ansIndex!==correctAns.length-1)
                                                                return <b>{ans} , </b>
                                                            else
                                                                return <b>{ans}</b>
                                                        })}</p>
                                                    </div>):(rightCount===0 && wrongCount===0?
                                                            <div>
                                                                {this.state.attemped===true?
                                                                    <p>You Have Not attempted this question</p>:null}
                                                                <p>The Correct Answers are {correctAns.map((ans,ansIndex)=>{
                                                                    if(ansIndex!==correctAns.length-1)
                                                                        return <b>{ans} , </b>
                                                                    else
                                                                        return <b>{ans}</b>
                                                                })}</p>
                                                            </div>:
                                                            <div>
                                                                <p>Your answer is incorrect</p>
                                                                <p>The Correct Answers are {correctAns.map((ans,ansIndex)=>{
                                                                    if(ansIndex!==correctAns.length-1)
                                                                        return <b>{ans} , </b>
                                                                    else
                                                                        return <b>{ans}</b>
                                                                })}</p>
                                                            </div>
                                                             )
                                                 }
                                                </div>
                                            </FormGroup>
                                            :   <div>
                                                    {this.state.attemped===true?
                                                        <FormGroup className="form-inline col-md-11 text-left">
                                                            <FormLabel className="m-1">Ans</FormLabel>
                                                            <FormControl
                                                            className="col-xm-12 col-md-9 m-2"
                                                            as="textarea"
                                                            rows={3}
                                                            name="answer"
                                                            width={300}
                                                            readOnly
                                                            columns = {200}
                                                            value = {this.state.answers[index].answer}
                                                            placeholder="Write your answer here"
                                                            />
                                                            <div>
                                                                <p>Your score is {this.state.answers[index].marks} out of {question.marks}</p>
                                                            </div>
                                                        </FormGroup > : null
                                                    }
                                                </div> 
                                    }
                                </div> 
                            </div>
                            )
                        })                 
                    }
                </div>
                <div className="text-center m-4">
                    <Button className="mb-5" onClick={()=>this.props.history.goBack()}>Finish Review</Button>
                </div>
            </div>
        )
    }
}

export default withRouter(StudentReview)
