import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {
    Container,
    Row,
    Form,
    FormGroup,
    FormControl,
    FormLabel,
    Alert
  } from 'react-bootstrap';
import '../docs/css/login.css'
import Spinner from './Spinner';

class ForgotPassword extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             stage : 0,
             userId : '',
             code : '',
             password : '',
             confirmPassword : '',
             seconds : 10,
             time : '',
             loader : false
        }
        this.timer = 0;
        this.confirmRef = React.createRef();
    }

    sendMail = ()=>{
        const role = localStorage.getItem("role");
        if(this.state.userId===""){
            alert("User Id cannot be empty");
        }
        else{
            this.setState({
                loader : true
            })
            console.log(JSON.stringify({
                userId : this.state.userId
            }));
            console.log(this.state.userId);
            fetch(`https://online-exam-back.herokuapp.com/${role}/forgotPassword`,{
                method : 'post',
                body : JSON.stringify({
                    userId : this.state.userId
                }),
                headers : {
                    'Content-Type': 'application/json'
                }
            }).then(res=>{
                return res.json();
            }).then(res=>{
                if(res.status===200){
                    this.setState({
                        stage : 1,
                        loader : false
                    });
                }
                else{
                    alert(res.msg);
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
    }

    componentDidMount = ()=>{
        window.addEventListener('beforeunload',this.saveStage);
        if(localStorage.getItem("forgotUser")!==null){
            this.setState({
                userId : localStorage.getItem("forgotUser"),
                // stage : 0
            })
        }
        if(localStorage.getItem("forgotStage")!==null && localStorage.getItem("forgotStage")!==""){
            this.setState({
                stage : parseInt(localStorage.getItem("forgotStage"))
            })
        }
    }

    componentWillUnmount = ()=>{
        localStorage.removeItem("forgotStage");
        localStorage.removeItem("forgotUser");
        window.removeEventListener('beforeunload',this.saveStage());
    }

    saveStage = ()=>{
        localStorage.setItem("forgotStage",this.state.stage);
        localStorage.setItem("forgotUser",this.state.userId);
    }

    verifyCode = ()=>{
        const role = localStorage.getItem("role");
        if(this.state.code==="")
        {
            alert("please enter the code");
        }
        else{
            this.setState({
                loader : true
            })
            fetch(`https://online-exam-back.herokuapp.com/${role}/verifyCode`,{
                method : 'post',
                body : JSON.stringify({
                    code : this.state.code,
                    userId : this.state.userId
                }),
                headers : {
                    'Content-Type': 'application/json'
                }
            }).then(res=>{
                return res.json();
            }).then(res=>{
                if(res.status===200){
                    this.setState({
                        stage : 2,
                        loader : false
                    })
                }
                else{
                    alert(res.msg);
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
    }

    updatePassword = ()=>{
        const role = localStorage.getItem("role");
        // alert("succesfully updated");
        if(this.state.password===""){
            alert("Password field cannot be empty");
        }
        else if(this.state.confirmPassword===""){
            alert("Confirm Password field cannot be empty");
        }
        else if(this.state.password!==this.state.confirmPassword){
            alert("Password and Confirm password doesn't match");
        }
        else{
            this.setState({
                loader : true
            })
            // https://online-exam-back.herokuapp.com
            // http://localhost:4000
            fetch(`https://online-exam-back.herokuapp.com/${role}/resetPassword`,{
                method : 'post',
                body : JSON.stringify({
                    password : this.state.password,
                    confirmPassword : this.state.confirmPassword,
                    userId : this.state.userId
                }),
                headers : {
                    'Content-Type': 'application/json'
                }
            }).then(res=>{
                return res.json();
            }).then(res=>{
                console.log(res);
                if(res.status===200){
                    alert("password updated succesfully");
                    this.setState({
                        loader : false
                    })
                    this.props.history.push('/');
                }
                else{
                    alert(res.msg);
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
    }

    handleKeyPress = (e)=>{
        if(e.target.name==="userId" && e.charCode===13 ) {
            this.sendMail();
        }
        else if(e.charCode===13 && e.target.name==="confirmPassword"){
            this.updatePassword();
        }
        else if(e.charCode===13  && e.target.name==="code"){
            this.verifyCode();
        }
        else if(e.charCode===13  && e.target.name==="password"){
            this.confirmRef.current.focus();
        }
    }
    
    handleChange = (e) =>{
        const value=e.target.value;
        this.setState({
            [e.target.name] : value
        })
    }

    render() {
        // console.log("render "+this.state.stage);
        return (
            <div className="mx-auto text-center mauto">
                {this.state.stage===0?
                <div className="pt-5">
                    {this.state.loader?<Spinner text="Sending Email..."/>:null}
                    <div className="form col-xl-6 col-lg-5 col-md-6 col-sm-8 col-11">
                    <h3 className="mt-5">Enter your {localStorage.getItem("role")} Id</h3>
                    <h3>A code will be sent to your email</h3>
                        <FormGroup className="form-inline m-2 mt-5">
                            <FormLabel className="idlabel">Id</FormLabel>
                            <FormControl
                            type="text"
                            name="userId"
                            placeholder={`${localStorage.getItem('role')} Id`}
                            onChange={this.handleChange}
                            onKeyPress = {(e)=>this.handleKeyPress(e)}
                            value={this.state.userId}
                            className="input1 col-7 col-sm-7 col-xl-8 m-1 mb-2 border border-dark"
                            />
                        </FormGroup >
                        <Button className="mb-3 mr-3" onClick={()=>this.props.history.goBack()}>Back</Button>
                        <Button className="mb-3 ml-3" onClick={()=>this.sendMail()}>Send</Button>
                    </div>
                </div>:
                 this.state.stage===1?
                 <div>
                     {this.state.loader?<Spinner text="Verifying code..."/>:null}
                     <div className="form col-xl-6 col-lg-5 col-md-6 col-sm-8 col-11">
                        <h3 className="mt-3">A code is sent to your email</h3>
                        <FormGroup className="form-inline m-2 mt-5">
                            <FormLabel className="codelabel">Code</FormLabel>
                            <FormControl
                            type="text"
                            name="code"
                            placeholder=""
                            onChange={this.handleChange}
                            onKeyPress = {(e)=>this.handleKeyPress(e)}
                            value={this.state.code}
                            className="input1 col-7 col-sm-7 col-xl-8 mb-2 m-1 border border-dark"
                            />
                        </FormGroup >
                        <Button className="mb-3 mr-3" onClick={()=>this.setState({stage : 0})}>Back</Button>
                        <Button className="mb-3 ml-3"  onClick={()=>this.verifyCode()}>Verify</Button>
                     </div>
                 </div>:
                 this.state.stage===2?
                 <div>
                     {this.state.loader?<Spinner text="Updating Password..."/>:null}
                    <div className="form col-xl-6 col-lg-5 col-md-6 col-sm-8 col-11">
                        <h3 className="mt-3">Set Your New Password</h3>
                        <FormGroup className="form-inline m-1 mt-5">
                            <FormLabel className="form-label">Password</FormLabel>
                            <FormControl
                            type="password"
                            name="password"
                            placeholder="password"
                            onChange={this.handleChange}
                            onKeyPress = {(e)=>this.handleKeyPress(e)}
                            value={this.state.password}
                            className="input1 col-7 col-sm-7 col-xl-8 m-2 border border-dark"
                            />
                        </FormGroup >
                        <FormGroup className="form-inline ">
                            <FormLabel className="form-label m-1">Confirm Password</FormLabel>
                            <FormControl
                            ref = {this.confirmRef}
                            type="password"
                            name="confirmPassword"
                            placeholder="confirm password"
                            onChange={this.handleChange}
                            onKeyPress = {(e)=>this.handleKeyPress(e)}
                            value={this.state.confirmPassword}
                            className="input1 col-7 col-sm-7 col-xl-8 m-2 border border-dark"
                            />
                        </FormGroup >
                        <Button className="mb-3 mr-3" onClick={()=>this.setState({stage : 0})}>Back</Button>
                        <Button className="mb-3 ml-3" onClick={()=>this.updatePassword()}>Update</Button>
                    </div>
                </div>
                 :null}
            </div>
        )
    }
}

export default withRouter(ForgotPassword)
