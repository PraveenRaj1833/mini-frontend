import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { FormGroup,FormControl,FormLabel,FormCheck,Button,Form} from 'react-bootstrap'
import '../docs/css/review.css'
class ReviewTest extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            testId : localStorage.getItem('testId'),
            studentId : localStorage.getItem('studentId'),
            totalMarks : '',
            dateTime : '',
            testName : '',
            testType : '',
            loader : true,
            evaluated : false,
            duration : '',
            questions : [],
            answers : [],
            attemptTime : '',
            submitTime : '',
            marks : [],
            correct : [],
            courseId : localStorage.getItem('courseId'),
        }
    }

    logout = ()=>{
        //console.log("logout called");
        localStorage.clear();
        this.props.history.push('/');
    }

    componentDidMount = ()=>{
        fetch('https://online-exam-back.herokuapp.com/teacher/reviewTest',{
            method : 'post',
            headers : {
                'Content-type' : 'application/json',
                Authorization : localStorage.getItem('token')
            },
            body : JSON.stringify({
                testId : localStorage.getItem('testId'),
                studentId : localStorage.getItem('studentId')
            })
        }).then(res=>{
            return res.json();
        }).then(res=>{
            console.log(res);
            if(res.status===200){
                this.setState({
                    testId : res.result.testId,
                    studentId : res.result.studentId,
                    totalMarks : res.result.totalMarks,
                    dateTime : res.result.dateTime,
                    duration : res.result.duration,
                    courseId : res.result.courseId,
                    testName : res.result.testName,
                    testType : res.result.testType,
                    attemptDate : res.result.attemptDate,
                    submitDate : res.result.submitDate,
                    evaluated : res.result.evaluated,
                    studentMarks : res.result.studentMarks,
                    questions : res.result.questions,
                    answers : res.result.answers
                },()=>{
                    var i,j;
                    const questions = this.state.questions;
                    const answers = this.state.answers;
                    const marks=[];
                    const correct = [];
                    for(i=0;i<this.state.questions.length;i++){
                        if(questions[i].qType==="mcqs"){
                            if(answers[i].optionId==='')
                            {
                                correct.push(0);
                                marks.push(0);
                                continue;
                            }
                            if(parseInt(answers[i].optionId)===questions[i].right){
                                correct.push(1);
                                marks.push(questions[i].marks);
                            }
                            else{
                                correct.push(-1);
                                marks.push(0);
                            }
                        }
                        else if(questions[i].qType==="checkBox"){
                            if(answers[i].options.length===0){
                                correct.push(0);
                                marks.push(0);
                                continue;
                            }
                            if(answers[i].options.length===questions[i].right.length){
                                for(j=0;j<answers[i].options.length;j++){
                                    if(questions[i].right.includes(parseInt(answers[i].options[j])))
                                        continue;
                                    else
                                        break;
                                }
                                if(j===answers[i].options.length){
                                    correct.push(1);
                                    marks.push(questions[i].marks);
                                }
                                else{
                                    correct.push(-1);
                                    marks.push(0);
                                }
                            }
                            else{
                                correct.push(-1);
                                marks.push(0);
                            }
                        }
                        else{
                            if(this.state.evaluated===false){
                                correct.push(false);
                                marks.push('');
                            }
                            else{
                                correct.push(false);
                                marks.push(answers[i].marks);
                            }
                        }
                    }
                    this.setState({
                        marks : marks,
                        correct : correct
                    })
                })
            }
            else if(res.status===402){
                alert("Session expired, Please Login again");
                this.logout();
            }
            else{
                alert(res.msg);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    handleChange = (e,index)=>{
        var value = e.target.value;
        const marks = this.state.marks;
        marks[index]=value;
        this.setState({
            marks : marks
        })
    }

    handleSubmit = ()=>{
        var total=0;
        var f=0,i;
        const marks = this.state.marks;
        for(i=0;i<marks.length;i++){
            if(marks[i]===''){
                alert(`Please Mention Marks for queston ${i+1}`);
                f=1;
            }
            else if(Number.isNaN(marks[i])){
                alert(`Invalid marks for queston ${i+1}`);
                f=1;
            }
            else{
                var m = parseInt(marks[i]);
                if(m>this.state.questions[i].marks){
                    alert("Marks awarded cannot be greater than question marks - queston ${i+1}");
                    f=1;
                }
                else{
                    total+=m;
                }
            }
        }
        if(f===0){
            // alert(`total marks is ${total}`);
            const answers = [];
            var i;
            for(i=0;i<this.state.questions.length;i++){
                answers.push({
                    marks : parseInt(this.state.marks[i]),
                    correct : this.state.correct[i],
                    questionId : this.state.questions[i].questionId,
                    qType : this.state.questions[i].qType,
                })
            }
            console.log("ans");
            console.log(answers);

            fetch('https://online-exam-back.herokuapp.com/teacher/uploadResult',{
                method : 'post',
                headers : {
                    'Content-type' : 'application/json',
                    Authorization : localStorage.getItem('token')
                },
                body : JSON.stringify({
                    testId : localStorage.getItem('testId'),
                    studentId : localStorage.getItem('studentId'),
                    answers : answers
                })
            }).then(res=>{
                return res.json();
            }).then(res=>{
                console.log(res);
                if(res.status===200){
                    alert("Result uploaded succesfully");
                    this.props.history.goBack();
                }
                else if(res.status===402){
                    alert("Session expired, Please Login again");
                    this.logout();
                }
                else{
                    alert(res.msg);
                }
            }).catch(err=>{
                console.log(err);
            })
        }
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
            <div className="ml-2">
                <br/>
                <h1 id="rth1" className="mx-auto mb-2 text-center">{this.state.testName}</h1>
                
                {/* <h2>{this.state.studentId}</h2> */}
                <div className="border border-4 m-2">
                    <table>
                        <tr>
                            <th className="w-45">Student Id </th>
                            <td className="w-50">{this.state.studentId}</td>
                        </tr>
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
                            <td>{this.state.evaluated===true?"Evaluated":"Not Evaluated"}</td>
                        </tr>
                        <tr>
                            <th>Score</th>
                            {this.state.evaluated===true?
                            <td>{this.state.studentMarks} out of {this.state.totalMarks} &nbsp; ({(this.state.studentMarks/this.state.totalMarks)*100}%)</td>
                            : <td> -- </td>}           
                        </tr>
                    </table>
                </div>
                <div>
                    {
                        this.state.questions.map((question,index)=>{
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
                                                    return (
                                                        <div key={optIndex} className="">
                                                            <label>
                                                                <input type="radio" value={option.optionId} readOnly name={namee}
                                                                    checked={checked} className="p-1"/>
                                                                &nbsp;{option.desc}&nbsp; 
                                                                {
                                                                    checked===true?
                                                                    (this.state.correct[index]===1?
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
                                            <div className={this.state.correct[index]===0?"unattempted p-2 mr-2":
                                            (this.state.correct[index]===-1?"wrong p-2 mr-2":"right p-2 mr-2")}>
                                                {this.state.correct[index]===0?
                                                <div>
                                                    <p>Question Unattempted</p>
                                                    <FormGroup className="form-inline ">
                                                        <FormLabel className="m-1">Marks Awarded</FormLabel>
                                                        <FormControl
                                                        className="col-6 m-2"
                                                        name="marks"
                                                        value = {this.state.marks[index]}
                                                        readOnly
                                                        />    
                                                    </FormGroup>
                                                </div>:(this.state.correct[index]===-1?
                                                <div>
                                                    <p>Incorrect Answer</p>
                                                    <FormGroup className="form-inline ">
                                                        <FormLabel className="m-1">Marks Awarded</FormLabel>
                                                        <FormControl
                                                        className="col-6 m-2"
                                                        name="marks"
                                                        value = {this.state.marks[index]}
                                                        readOnly
                                                        />    
                                                    </FormGroup>
                                                </div>:
                                                <div>
                                                    <p>Correct Answer</p>
                                                    <FormGroup className="form-inline ">
                                                        <FormLabel className="m-1">Marks Awarded</FormLabel>
                                                        <FormControl
                                                        className="col-6 m-2"
                                                        name="marks"
                                                        value = {this.state.marks[index]}
                                                        readOnly
                                                        />    
                                                    </FormGroup>
                                                </div>
                                                )}
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
                                                        if(checked===true){
                                                            if(question.right.includes(parseInt(option.optionId)))
                                                             {
                                                                correct = true;
                                                                //rightCount+=1;
                                                             }   
                                                            else
                                                            {
                                                                correct = false;
                                                                //wrongCount+=1;
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
                                                <div className={this.state.correct[index]===0?"unattempted p-2 mr-2":
                                                    (this.state.correct[index]===-1?"wrong p-2 mr-2":"right p-2 mr-2")}>
                                                    {this.state.correct[index]===0?
                                                    <div>
                                                        <p>Question Unattempted</p>
                                                        <FormGroup className="form-inline ">
                                                            <FormLabel className="m-1">Marks Awarded</FormLabel>
                                                            <FormControl
                                                            className="m-2"
                                                            name="marks"
                                                            value = {this.state.marks[index]}
                                                            readOnly
                                                            />    
                                                        </FormGroup>
                                                    </div>:(this.state.correct[index]===-1?
                                                    <div>
                                                        <p>Incorrect Answer</p>
                                                        <FormGroup className="form-inline ">
                                                            <FormLabel className="m-1">Marks Awarded</FormLabel>
                                                            <FormControl
                                                            className=" m-2"
                                                            name="marks"
                                                            value = {this.state.marks[index]}
                                                            readOnly
                                                            />    
                                                        </FormGroup>
                                                    </div>:
                                                    <div>
                                                        <p>Correct Answer</p>
                                                        <FormGroup className="form-inline ">
                                                            <FormLabel className="m-1">Marks Awarded</FormLabel>
                                                            <FormControl
                                                            className=" m-2"
                                                            name="marks"
                                                            value = {this.state.marks[index]}
                                                            readOnly
                                                            />    
                                                        </FormGroup>
                                                    </div>
                                                    )}
                                                </div>
                                            </FormGroup>
                                            :   <div>
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
                                                        placeholder="No Answer"
                                                        />
                                                        <div>
                                                            <FormGroup className="form-inline ">
                                                                <FormLabel className="m-1">Marks Awarded</FormLabel>
                                                                <FormControl
                                                                className="m-2"
                                                                readOnly={this.state.evaluated}
                                                                name="marks"
                                                                value = {this.state.marks[index]}
                                                                onChange = {(e)=>this.handleChange(e,index)}
                                                                />    
                                                            </FormGroup>
                                                        </div>
                                                    </FormGroup > 
                                                </div> 
                                    }
                                </div> 
                            </div>
                            )
                        })                 
                    }
                </div>
                <div className="text-center row">
                {this.state.evaluated===false?
                    <Button className="mx-auto mt-3 mb-5 " onClick={()=>this.handleSubmit()}>Upload Results</Button>:null
                }
                    <Button className="mx-auto mt-3 mb-5 " onClick={()=>this.props.history.goBack()}>Back</Button>
                </div>
                
            </div>
        )
    }
}

export default withRouter(ReviewTest)
