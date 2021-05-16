import {withRouter} from 'react-router-dom'
import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import {Modal,ListGroup,Badge} from 'react-bootstrap'
// import {RadioGroup,Radio} from 'react-radio-group'
import { FormGroup,FormControl,FormLabel,FormCheck } from 'react-bootstrap'
import Spinner from './Spinner';

class EditTest extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            totalMarks : '',
            duration : '',
            date : '',
            testId : '',
            courseId : localStorage.getItem('courseId'),
            time : '',
            dateTime : '',
            questions : [],
            deletedQues : [],
            deletedOpts : [],
            loader : true,
            testName:'',
            testType : '',
            addQue : false
        }
        this.inputRefs = [];
        this.dateRef = React.createRef();
        this.timeRef = React.createRef();
    }

    componentDidMount = ()=>{
        // console.log("its ok myaan");
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
            // console.log("after suc");
            console.log(res);
            // console.log(res.result.questions);
            // console.log("bef suc");
            if(res.status==200){
                console.log("success 2")
                this.setState({
                    testId : res.result.testId,
                    totalMarks : res.result.totalMarks,
                    dateTime : res.result.dateTime,
                    duration : res.result.duration,
                    courseId : res.result.courseId,
                    questions : res.result.questions,
                    testName : res.result.testName,
                    testType : res.result.testType
                },()=>{
                    // console.log('done');
                    // console.log(this.state);
                    var i,j;
                    var date = new Date(this.state.dateTime);
                    var d = ""+String(date.getDate()).padStart(2,0)+"-"+String(date.getMonth()+1).padStart(2,0)+"-"+
                    String(date.getFullYear()).padStart(4,0);
                    var dd = date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,0)+"-"+String(date.getDate()).padStart(2,0);
                    var t = ""+String(date.getHours()).padStart(2,0)+":"+String(date.getMinutes()).padStart(2,0);
                    this.timeRef.current.value=t;
                    this.dateRef.current.value=dd;
                    // console.log(d);
                    // console.log(t);
                    const questions = this.state.questions;
                    for(i=0;i<questions.length;i++){
                        if(questions[i].qType==="mcqs")
                        {
                            for(j=0;j<questions[i].options.length;j++){
                                if(questions[i].right===questions[i].options[j].optionId){
                                    questions[i].right=j;
                                    break;
                                }
                            }
                        }
                        else if(questions[i].qType==="checkBox"){
                            var ri8 = [];
                            for(j=0;j<questions[i].options.length;j++){
                                if(questions[i].right.includes(questions[i].options[j].optionId)){
                                    ri8.push(j);
                                    // break;
                                }
                            }
                            questions[i].right=ri8;
                        }
                        this.inputRefs.push(React.createRef());
                    }
                    // console.log("jaja");
                    // console.log(questions);
                    this.setState({
                        questions : questions,
                        loader : false,
                        date : dd,
                        time : t,
                        dateTime : date
                    });
                });
            }
            else{
                this.setState({
                    loader : false
                })
                alert(res.message);
            }
        }).catch(err=>{
            console.log(err);
            this.setState({
                loader : false
            })
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

    handleQuestionChange = (e,index) => {
        const Questions = this.state.questions;
        if(e.target.name==="right"){
            if(Questions[index].qType==="mcqs"){
                if(e.target.value!==''){
                    Questions[index]={
                        ...Questions[index],
                        [e.target.name] : parseInt(e.target.value.trim())
                    }; 
                }
                else{
                    Questions[index]={
                        ...Questions[index],
                        [e.target.name] : (e.target.value.trim())
                    }; 
                }
                
            }
            else if(Questions[index].qType==="checkBox"){
                const right = e.target.value.split(",").map((r,i)=>{
                    if(Number.isInteger(parseInt(r)))
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
        if(this.inputRefs[index].current.className.includes("border-danger") && e.target.value!==''){
            this.inputRefs[index].current.className = this.inputRefs[index].current.className.split("border-danger")[0]
                                        +this.inputRefs[index].current.className.split("border-danger")[1];
            this.inputRefs[index].current.className = this.inputRefs[index].current.className + " border-dark"
        }
    }

    addOption = (index) => {
        const Options = this.state.questions[index].options;
        Options.push({
            desc : "",
            optionId : ''
        });
        const Questions = this.state.questions;
        Questions[index].options = Options;
        this.setState({
            ...this.state,
            questions : Questions
        }) 
    }

    deleteQuestion = (delIndex,question)=>{
        const delQ = this.state.deletedQues;
        if(question.questionId!==''){
            delQ.push({
                questionId : question.questionId,
                qType : question.qType
            });
        }
        const questions = this.state.questions.filter((question,index)=>{
                                return delIndex!==index;
                            });
        this.setState({
            questions : questions,
            deletedQues : delQ
        });
        this.inputRefs = this.inputRefs.filter((ref,index)=>{
                            return index!==delIndex;
                        })
    }

    deleteOption = (index,delOptIndex,option)=>{
        const delO = this.state.deletedOpts;
        if(option.optionId!==''){
            delO.push(option.optionId);
        }
        console.log(index,delOptIndex);
        console.log(this.state.questions[index].options)
        const options = this.state.questions[index].options.filter((opt,optIndex)=>{
                                return optIndex!==delOptIndex;
                            });
        console.log(options)
        const Questions = this.state.questions;
        Questions[index].options = options;
        this.setState({
            questions : Questions,
            deletedOpts : delO
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

    openModal = ()=>{
        this.setState({
            addQue : true
        })
    }

    addQuestion = (type) => {
        const Questions = this.state.questions;
        this.inputRefs.push(React.createRef());
        if(type==="mcqs"){
            Questions.push({
                qType : "mcqs",
                options : [],
                marks : 1,
                desc : "",
                right : "",
                questionId : ''
            });
        }
        else if(type==="checkBox"){
            Questions.push({
                qType : "checkBox",
                options : [],
                marks : 1,
                desc : "",
                right : [],
                questionId : ''
            });
        }
        else{
            Questions.push({
                qType : "desc",
                marks : 1,
                desc : "",
                questionId : ''
            });
        }
        
        // console.log(Questions);
        this.setState({
            ...this.state,
            questions : Questions
        });
        this.closeModal();
    }


    closeModal = ()=>{
        this.setState({
            addQue : false
        })
    }

    logout = ()=>{
        //console.log("logout called");
        localStorage.clear();
        this.props.history.push('/');
    }

    handleSubmit=()=>{
        var f=0;
    
        console.log(this.state.deletedOpts);
        console.log(this.state.deletedQues);
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
            var marks = 0;
            for(var i=0;i<this.state.questions.length;i++){
                if(questions[i].qType==="desc"){
                    desc = true;
                }
                if(questions[i].desc===''){
                    alert("question Description cannot be empty- Question "+(i+1));
                    f=1;
                    this.inputRefs[i].current.focus();
                    console.log(this.inputRefs[i].current);
                    this.inputRefs[i].current.className =this.inputRefs[i].current.className.split("border-dark")[0]+this.inputRefs[i].current.className.split("border-dark")[1];
                    this.inputRefs[i].current.className = this.inputRefs[i].current.className + " border-danger";
                    // this.inputRefs[i].current.style['border-color']="red";
                }
                else if((questions[i].qType==="mcqs" || questions[i].qType==="checkBox") && questions[i].options.length===0){
                    alert("please mention options for question "+i);
                    f=1;
                    this.inputRefs[i].current.focus();
                }
                else if(questions[i].qType==="mcqs" && questions[i].right===""){
                    alert("please mention right option for question "+i);
                    f=1;
                    this.inputRefs[i].current.focus();
                }
                else if(questions[i].qType==="checkBox" && questions[i].right.length===0){
                    alert("please mention right options for question "+i);
                    f=1;
                    this.inputRefs[i].current.focus();
                }
                else if(questions[i].marks==="" || questions[i].marks===0){
                    alert("please mention marks for question "+i);
                    f=1;
                    this.inputRefs[i].current.focus();
                }
                else{
                    marks+=parseInt(questions[i].marks);
                    if(questions[i].qType==="mcqs" || questions[i].qType==="checkBox"){
                        const options = questions[i].options;
                        for(var j=0;j<questions[i].options.length;j++){
                            if(options[j].desc===""){
                                alert("option description cannot be null at question "+i+ " option "+j);
                                f=1;
                                this.inputRefs[i].current.focus();
                                break;
                            }
                        }
                    }
                }
            }
            if(f===0){
                if(marks!==parseInt(this.state.totalMarks))
                {
                    f=1;
                    alert(`Sum of marks doesn't tally with total Marks! sum is ${marks}`);    
                }
            }
            // console.log(JSON.stringify({
            //     testId : this.state.testId,
            //     totalMarks : this.state.totalMarks,
            //     duration : this.state.duration,
            //     courseId : this.state.courseId,
            //     dateTime : this.state.dateTime,
            //     questions : this.state.questions,
            //     testName : this.state.testName,
            //     testType : desc===true?"desc":"mcqs"
            // }))
            if(f===0){
                this.setState({
                    loader : true
                });
                console.log(JSON.stringify({
                    testId : this.state.testId,
                    totalMarks : this.state.totalMarks,
                    duration : this.state.duration,
                    courseId : this.state.courseId,
                    dateTime : this.state.dateTime,
                    questions : this.state.questions,
                    testName : this.state.testName,
                    testType : desc===true?"desc":"mcqs"
                }))
                // 'https://online-exam-back.herokuapp.com/teacher/createTest'
                // http://localhost:4000
                fetch('https://online-exam-back.herokuapp.com/teacher/editTest',{
                    method : 'post',
                    headers : {
                        'Content-Type' : 'application/json',
                        Authorization : localStorage.getItem('token')    
                    },
                    body : JSON.stringify({
                        testId : this.state.testId,
                        totalMarks : this.state.totalMarks,
                        duration : this.state.duration,
                        courseId : this.state.courseId,
                        dateTime : this.state.dateTime,
                        questions : this.state.questions,
                        testName : this.state.testName,
                        testType : desc===true?"desc":"mcqs",
                        // deletedOpts : this.state.deletedOpts,
                        deletedQues :this.state.deletedQues
                    }),
                }).then(res=>{
                    console.log(res);
                    return res.json();
                }).then(res=>{
                    console.log(res);
                    if(res.status===200){
                        alert(res.msg);
                        console.log("success");
                        localStorage.setItem('testId',res.result.testId);
                        console.log(localStorage.getItem('testId'));
                        // this.props.history.push('/teacher/viewTest');
                        this.props.history.goBack();
                    }
                    else if(res.status===402){
                        alert("session Expired , please login again");
                        this.logout();
                    }
                    else{
                        alert(res.msg);
                    }
                    this.setState({
                        loader : false
                    })
                }).catch(err=>{
                    console.log(err);
                    this.setState({
                        loader : false
                    })
                })
            }
        }
    }

    render() {
        // console.log("render");
        // console.log(this.state.loader);
        return (
            <div className="m-2 mb-5">
                {this.state.loader===true?<Spinner></Spinner>:null}
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

                <h2>Edit Test</h2>
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
                        ref={this.dateRef}
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
                        ref={this.timeRef}
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
                                <div className="text-center row" key={question.questionId}>
                                    <div ref={this.inputRefs[index]} tabIndex="0" className="col-xm-9 col-sm-9 col-md-10 border border-3 border-dark ml-2 mr-2 mt-2">
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
                                                        onClick={()=>this.deleteOption(index,optIndex,opt)}></i>
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
                                        </div>:null}
                                    </div>
                                    {index!==0 || this.state.questions.length!==1?
                                    <i class="trash alternate icon red big ml-2 my-auto" 
                                    data-toggle="tooltip" data-placement="top" title="Delete Question"
                                    onClick={()=>{
                                        console.log("delete question"+index)
                                        this.deleteQuestion(index,question)}
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

export default withRouter(EditTest)
