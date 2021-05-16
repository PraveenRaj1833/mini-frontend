import React, { Component } from 'react'
import Spinner from './Spinner'
import {withRouter, Prompt} from 'react-router-dom'
import { FormGroup,FormControl,FormLabel,FormCheck,Form } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import {Modal,ListGroup,Badge} from 'react-bootstrap'
import '../docs/css/attemptTest.css'
import '../docs/css/header.css'

class AttempTest extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            totalMarks : '',
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
            questions : [],
            answers : [],
            seconds : 300,
            stDate : '',
            endDate : '',
            showSubmitModel : false,
            loader : true,
            msg : 'loading...',
            submit : false
        }
        this.timer = 0;
        this.countDown = this.countDown.bind(this);
    }

    logout = ()=>{
        //console.log("logout called");
        // localStorage.clear();
        this.props.history.push('/');
    }

    handleModelShow = ()=>{
        this.setState({
            showSubmitModel : true
        })
    }

    handleModelHide = ()=>{
        this.setState({
            showSubmitModel : false
        })
    }

    componentDidMount = ()=>{
        console.log("Did mount called...");
        window.addEventListener('beforeunload',this.saveTime);
        console.log(this.props.router);
        fetch('https://online-exam-back.herokuapp.com/student/attemptTest',{
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
            if(res.status===200){
                this.setState({
                    testId : res.result.testId,
                    totalMarks : res.result.totalMarks,
                    dateTime : res.result.dateTime,
                    duration : res.result.duration,
                    courseId : res.result.courseId,
                    questions : res.result.questions,
                    seconds : res.result.duration*60,
                    testName : res.result.testName,
                    testType : res.result.testType
                },()=>{
                    var answers = [];
                    var i;
                    for(i=0;i<this.state.questions.length;i++){
                        if(this.state.questions[i].qType==="mcqs"){
                            answers.push({
                                questionId : this.state.questions[i].questionId,
                                qType : this.state.questions[i].qType,
                                optionId : '',
                                answer : '',
                                marks : this.state.questions[i].marks
                            })
                        }
                        else if(this.state.questions[i].qType==="checkBox"){
                            answers.push({
                                questionId : this.state.questions[i].questionId,
                                qType : this.state.questions[i].qType,
                                options : [],
                                answer : '',
                                marks : this.state.questions[i].marks
                            })
                        }else{
                            answers.push({
                                questionId : this.state.questions[i].questionId,
                                qType : this.state.questions[i].qType,
                                answer : '',
                                marks : this.state.questions[i].marks
                            })
                        }
                        
                    }
                    console.log("check");
                    console.log(answers);
                    var stDate = new Date();
                    let timeLeft;
                    var seconds=this.state.seconds;
                    if(localStorage.getItem('time')===null || Object.entries(JSON.parse(localStorage.getItem('time'))).length===0){
                        timeLeft= this.secondsToTime(this.state.seconds);
                        console.log("newer");
                    }
                    else{
                        console.log("older");
                        stDate = localStorage.getItem("startTime");
                        answers = JSON.parse(localStorage.getItem("answers"))
                        timeLeft = JSON.parse(localStorage.getItem('time'));
                        seconds = this.timeToSeconds(timeLeft);
                    }
                    // console.log("heree");
                    // console.log(timeLeft);
                    this.setState({
                        answers : answers,
                        time : timeLeft,
                        loader:false,
                        stDate : new Date(),
                        seconds : seconds
                    },()=>{
                        this.startTimer();
                        console.log("heree");
                        console.log(this.state);
                    })
                })
            }
            else if(res.status==402){
                this.setState({
                    loader : false
                })
                alert("Session Expired, please login again");
                if(this.state.time!={} && this.state.time!=''){
                    localStorage.setItem('time',this.state.time);
                }
                this.logout();
            }
            else if(res.status===203){
                this.setState({
                    testId : res.result.testId,
                    totalMarks : res.result.totalMarks,
                    dateTime : res.result.dateTime,
                    duration : res.result.duration,
                    courseId : res.result.courseId,
                    //questions : res.result.questions,
                    seconds : res.result.duration*60,
                    testName : res.result.testName,
                    testType : res.result.testType,
                    attempted : true,
                    loader : false
                });
                alert(res.msg);
                this.props.history.goBack();
            }
        }).catch(err=>{
            this.setState({
                loader : false
            })
            console.log(err);
            alert(err.msg);
        })
    }

    saveTime = ()=>{
        console.log("refresh called");
        localStorage.setItem("currentTest",this.state.testId);
        localStorage.setItem("answers",JSON.stringify(this.state.answers));
        localStorage.setItem("startTime",this.state.stDate);
        localStorage.setItem("stopTime",new Date());
        localStorage.setItem('time',JSON.stringify(this.state.time));
        clearInterval(this.timer);
    }

    componentWillUnmount = ()=>{
        // alert("unmounting");
        if(this.state.submit===false)
            this.submitTest();
        // else{
        //     localStorage.setItem("currentTest",this.state.testId);
        //     localStorage.setItem("answers",this.state.answers);
        //     localStorage.setItem("startTime",this.state.stDate);
        //     localStorage.setItem("stopTime",new Date());
        //     localStorage.setItem('time',JSON.stringify(this.state.time));
        // }
        clearInterval(this.timer);
        console.log("unmounted succesfully");
        window.removeEventListener('beforeunload',this.saveTime);
    }

    handleChange = (e,index)=>{
        const answers = this.state.answers;
        var value = e.target.value;
        // console.log(index);
        // console.log(e.target.value);
        // console.log(e.target.name);
        // console.log(e);
        if(answers[index].qType==="mcqs"){
            answers[index]["optionId"] = parseInt(e.target.value);
        }
        else if(answers[index].qType==="checkBox"){
            value=parseInt(value);
            if(answers[index].options.includes(value)){
                const ans = answers[index].options.filter((a,i)=>{
                            return a!==value;
                        });
                answers[index].options=ans;
            }
            else{
                answers[index].options.push(value);
            }
        }
        else{
            answers[index].answer=value;
        }
        
        this.setState({
            answers : answers
        },()=>{
            console.log("answers")
            console.log(this.state.answers);
        });
    }

    timeToSeconds(time){
        return time.h*60*60+time.m*60+time.s;
    }

    secondsToTime(secs){
        let hours = Math.floor(secs / (60*60));
        let divisor_for_min = secs % (60*60);
        let minutes = Math.floor(divisor_for_min/60);
        let divisor_for_sec = divisor_for_min % 60;
        let seconds = Math.ceil(divisor_for_sec);
        let obj = {
            'h' : hours,
            'm' : minutes,
            's' : seconds
        };
        return obj;
    }

    startTimer = ()=>{
        if(this.timer==0 && this.state.seconds>0){
            this.timer = setInterval(this.countDown,1000);
        }
    }

    countDown = ()=>{
        const seconds = this.state.seconds-1;
        this.setState({
            time : this.secondsToTime(seconds),
            seconds : seconds
        });

        if(seconds == 0){
            clearInterval(this.timer);
            alert("time is up");
            this.submitTest();
        }
    }


    submitTest = ()=>{
        // this.setState({
        //     msg : "Submitting Test...",
        //     loader : true,
        //     submit : true
        // })
        const user = JSON.parse(localStorage.getItem('user'));
        this.handleModelHide();
        clearInterval(this.timer);
        console.log(this.state.answers);
        console.log("submitting");
        // https://online-exam-back.herokuapp.com
        // http://localhost:4000
        fetch('https://online-exam-back.herokuapp.com/student/submitTest',{
            method : 'post',
            headers : {
                'Content-type' : 'application/json',
                Authorization : localStorage.getItem('token')
            },
            body : JSON.stringify({
                studentId : user.studentId,
                answers : this.state.answers,
                testType : this.state.testType,
                testId : this.state.testId,
                attemptDate : this.state.stDate,
                submitDate : new Date()
            })
        }).then(res=>{
            return res.json();
        }).then(res=>{
            console.log(res);
            if(res.status===200){
                alert("Test Submitted Succesfully");
                this.props.history.goBack();
            }
            else if(res.status==402){
                alert("Session Expired, please login again");
                this.logout();
            }else{
                alert(res.msg);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    render = ()=> {
        // console.log(localStorage.getItem("time"));
        // console.log(this.state.time);
        return (
            <div className="m-3 text-center">
                <Prompt when={this.state.submit===false} message={()=>{
                    // this.setState({
                    //     submit : true
                    // })
                    return "Do you want to submit?"
                    }}></Prompt>
                {this.state.loader===true?<Spinner text={this.state.msg}></Spinner>:null}
                
                <Modal show={this.state.showSubmitModel} onHide={this.handleModelHide}>
                    <Modal.Header closeButton>
                    <Modal.Title>Submit Test</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <i>Heyy</i> Are you sure you want to submit?
                        <br></br>
                        {
                            this.state.answers.map((answer,index)=>{
                                return (
                                    <Button className="h2 m-1" variant={
                                        answer.qType==="mcqs"?(answer.optionId===""?"secondary":"primary"):
                                        (answer.qType==="checkBox"?(answer.options.length===0?
                                            "secondary":"primary"):(answer.answer===""?"secondary":"primary"))
                                        }>
                                        <Badge variant={answer.qType==="mcqs"?(answer.optionId===""?"secondary":"primary"):
                                        (answer.qType==="checkBox"?(answer.options.length===0?
                                            "secondary":"primary"):(answer.answer===""?"secondary":"primary"))
                                        }>{index}</Badge>
                                    </Button>
                                )
                            })
                        } 

                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={()=>this.handleModelHide()}>
                        Back to test
                    </Button>
                    <Button variant="primary" onClick={()=>{
                        this.setState({
                            msg : "Submitting Test...",
                            loader : true,
                            submit : true
                        },()=>this.submitTest());
                        
                        }}>
                        Submit and Finish Test
                    </Button>
                    </Modal.Footer>
                </Modal>

                <h1>{this.state.testName}</h1>
                {this.state.attemped===true?
                <h3>You Have already attempted the test<br></br>No More attempts Allowed </h3>:
                <div>
                    <div className="sticky">
                        <i className="h2">Your test will end in </i>
                        <span className="text-primary bg-warning mx-auto my-auto h4 m-1">
                                {String(this.state.time.h).padStart(2,0)}
                                :{String(this.state.time.m).padStart(2,0)}:
                                {String(this.state.time.s).padStart(2,0)}
                        </span>
                    </div>
                    
                    {
                        this.state.questions.map((question,index)=>{
                            return(
                                <div className="m-2 border border-3">
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
                                    <div>
                                    {
                                        question.qType==="mcqs"?
                                        <FormGroup className=" ml-5 text-left">
                                            {/* <FormLabel id="label1">Gender</FormLabel> */}
                                            <fieldset >
                                            <Form.Group className="input ml-5">
                                                {question.options.map((option,optIndex)=>{
                                                    const namee="question"+index;
                                                    return (
                                                        
                                                            <Form.Check 
                                                            key={optIndex}
                                                            type="radio"
                                                            label={option.desc}
                                                            name={namee}
                                                            onChange={(e)=>this.handleChange(e,index)}
                                                            value={option.optionId}
                                                            />
                                                        
                                                    )
                                                })}
                                            </Form.Group>
                                            </fieldset>
                                        </FormGroup>
                                        : question.qType==="checkBox"?
                                            <FormGroup className="options ml-5 text-left">
                                                {/* <FormLabel id="label1">Gender</FormLabel> */}
                                                <fieldset >
                                                <Form.Group className="input ml-5">
                                                    {question.options.map((option,optIndex)=>{
                                                        const namee="question"+index;
                                                        return (
                                                            
                                                                <Form.Check 
                                                                key={optIndex}
                                                                type="checkbox"
                                                                label={option.desc}
                                                                name={namee}
                                                                onChange={(e)=>this.handleChange(e,index)}
                                                                value={option.optionId}
                                                                />
                                                            
                                                        )
                                                    })}
                                                </Form.Group>
                                                </fieldset>
                                            </FormGroup>
                                            :<FormGroup className="form-inline col-md-11 text-left">
                                                <FormLabel className="m-1">Ans</FormLabel>
                                                <FormControl
                                                className="col-xm-12 col-md-9 m-2"
                                                as="textarea"
                                                rows={3}
                                                name="answer"
                                                width={300}
                                                columns = {200}
                                                //value = {this.state.answers[index].answer}
                                                placeholder="Write your answer here"
                                                onChange={(e)=>this.handleChange(e,index)}
                                                />
                                            </FormGroup >
                                    }
                                </div> 
                                </div>
                            )
                        })
                    }
                    <Button className="mb-5" onClick={()=>this.handleModelShow()}>Finish Test</Button>
                </div>
            }
                
            </div>
        )
    }
}

export default withRouter(AttempTest)
