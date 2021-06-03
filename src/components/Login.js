import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

import Spinner from './Spinner'
import {
    Container,
    Row,
    Form,
    FormGroup,
    FormControl,
    FormLabel,
    Button,
    Alert
  } from 'react-bootstrap';
import '../docs/css/login.css'
// import e from 'express';

class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             userId : '',
             password : '',
             loader : false
        }
    }

    componentDidMount = ()=>{
        const role = localStorage.getItem("role");
        localStorage.clear();
        localStorage.setItem("role",role);
        console.log("login haha");
    }
    
    handleChange = (e)=>{
        const value = e.target.value;
        this.setState({
            [e.target.name] : value
        })
    }

    handleSubmit = () => {
        var f=0;
        if(this.state.userId===""){
            alert("UserId cannot be null");
            f=1;
        }
        else if(this.state.password===""){
            alert("Password Cannot be empty");
            f=1;
        }
        if(f===0){       
            this.setState({
                loader : true
            });
            const role = localStorage.getItem('role')
            fetch(`https://online-exam-back.herokuapp.com/${role}/login`,{
                method : 'post',
                body : JSON.stringify({
                    userId : this.state.userId,
                    password : this.state.password
                }),
                headers : {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                return res.json();
            }).then(res=>{
                
                console.log(res);
                if(res.status===200) {
                    localStorage.setItem('token',`Bearer ${res.token}`);
                    localStorage.setItem('user',JSON.stringify(res[role]));
                    if(role==="student")
                        localStorage.setItem('userId',res[role]['studentId']);
                    else
                        localStorage.setItem('userId',res[role]['teacherId']);
                    console.log(localStorage.getItem('userId'));

                    // console.log("in login")
                    // console.log(res[role])
                    // console.log(localStorage.getItem('user'))
                    // console.log("in login 2")
                    // this.setState({
                    //     loader : false
                    // })
                    // alert("login succesful");
                    this.props.history.push(`/${role}/dashboard`);
                }
                else{
                    alert(res.msg);
                }
                this.setState({
                    loader : false
                })
            }).catch(err => {
                this.setState({
                    loader : false
                })
                console.log(err);
            })
        }
    }

    handleKeyPress = (e)=>{
        // console.log("key pressed");
        // console.log(e);
        if(e.charCode===13){
            this.handleSubmit();
        }
    }

    render() {
        return (
            <div id="fbb">
                <div id="fb" className="text-center">
                      
                    {this.state.loader?<Spinner></Spinner>:null}
                <div id="form" className="form  col-xl-5 col-lg-5 col-md-6 col-sm-8 col-11 m-auto my-auto text-center">
                    {/* col-xl-5 col-lg-6 col-md-7 col-sm-8 col-10 */}
                    <h1 className="m-3 mb-4">{localStorage.getItem('role')==='student'?"Student":"Faculty"} Login</h1>
                    <div>
                    <FormGroup className="form-inline ">
                        <FormLabel className="form-label">Id</FormLabel>
                        <FormControl
                        type="text"
                        name="userId"
                        placeholder="Id"
                        onChange={this.handleChange}
                        onKeyPress = {(e)=>this.handleKeyPress(e)}
                        value={this.state.userId}
                        className="input1 col-7 col-sm-7 col-xl-8 m-2 border border-dark"
                        />
                    </FormGroup >
                    <p id="mail" className="warning"></p>
                    <FormGroup className="form-inline">
                        <FormLabel className="form-label">Password</FormLabel>
                        <FormControl
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        placeholder="Password"
                        onKeyPress = {(e)=>this.handleKeyPress(e)}
                        className="input col-7 col-sm-7 col-xl-8 m-2 border border-dark"
                        />
                    </FormGroup>
                    <p id="login" className="warning"/>
                    <FormGroup>
                        <Button type="submit" value="submit" className="m-2" onClick={() => this.handleSubmit()}>SignIn</Button>
                        <Button className="m-2" onClick={() => this.props.history.push (`/${localStorage.getItem('role')}/register`)}>
                            SignUp
                        </Button>
                        <br></br>
                        <span id="forgot" onClick={()=>this.props.history.push(`/forgotPassword`)}>Forgot Password?</span>
                    </FormGroup>
                    </div>

                </div>
                    <div className="text-center m-2">
                        <button className="btn btn-secondary" onClick={this.props.history.goBack}>Back</button>
                    </div>
        </div>
      </div>
        )
    }
}

export default withRouter(Login)
