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

class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             userId : '',
             password : '',
             loader : false
        }
    }
    
    handleChange = (e)=>{
        const value = e.target.value;
        this.setState({
            [e.target.name] : value
        })
    }

    handleSubmit = () => {
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

    render() {
        return (
           
            <div className="text-center mt-5">
                
                 {this.state.loader?<Spinner></Spinner>:null}
            <div className="form  col-xl-4 col-lg-5 col-md-6 col-sm-8 col-10 m-auto my-auto">
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
                    value={this.state.userId}
                    className="input1 col-xl-8 m-2"
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
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <p id="login" className="warning"/>
                <Button className="m-2" onClick={() => this.handleSubmit()}>SignIn</Button>
                <Button className="m-2" onClick={() => this.props.history.push ('/register')}>
                    SignUp
                </Button>
                </div>

            </div>
                <div className="text-center m-2">
                    <button className="btn btn-secondary" onClick={this.props.history.goBack}>Back</button>
                </div>
      </div>
        )
    }
}

export default withRouter(Login)
