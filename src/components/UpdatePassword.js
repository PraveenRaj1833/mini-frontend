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
  import '../docs/css/viewProfile.css'

class UpdatePassword extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            userId : '',
            currentPassword : '',
            newPassword : '',
            confirmPassword : '',
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
        var f=0;
        if(this.state.currentPassword===""){
            alert("Current Password Cannot be empty");
            f=1;
        }
        else if(this.state.newPassword===""){
            alert("New Password Cannot be empty");
            f=1;
        }
        else if(this.state.confirmPassword===""){
            alert("Confirm Password Cannot be empty");
            f=1;
        }
        else if(this.state.newPassword!==this.state.confirmPassword){
            alert("New Password and Confirm Password doesn't match");
            f=1;
        }
        if(f===0){
            this.setState({
                loader : true
            });
            console.log(JSON.stringify({
                userId : this.state.studentId,
                currentPassword : this.state.currentPassword,
                newPassword : this.state.newPassword,
                confirmPassword : this.state.confirmPassword
            }))
            const role = localStorage.getItem('role')
            fetch(`https://online-exam-back.herokuapp.com/student/updatePassword`,{
                method : 'post',
                headers : {
                    'Content-Type': 'application/json',
                    Authorization : localStorage.getItem('token')
                },
                body : JSON.stringify({
                    userId : this.state.userId,
                    currentPassword : this.state.currentPassword,
                    newPassword : this.state.newPassword,
                    confirmPassword : this.state.confirmPassword
                })
            }).then(res => {
                console.log(res)
                return res.json();
            }).then(res=>{
                
                console.log(res);
                if(res.status===200) {
                alert("Updated successfully")
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
    
    componentDidMount = ()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user.studentId)
        this.setState({
            userId : user.studentId,
            currentPassword : '',
            newPassword : '',
            confirmPassword : ''
             
        })
    }

    render() {
        return (
            <div id="tfbb">
            <div id="tfb" className="text-center mt-5">
                
                 {this.state.loader?<Spinner></Spinner>:null}
            <div id="tform" className="form  col-xl-4 col-lg-5 col-md-6 col-sm-8 col-10 m-auto my-auto">
                {/* col-xl-5 col-lg-6 col-md-7 col-sm-8 col-10 */}
                <h1 className="m-3 mb-4">{localStorage.getItem('role')==='student'?"Student":"Faculty"} Password Update</h1>
                <div>  
                <FormGroup className="form-inline ">
                    <FormLabel className="form-label">currentPassword</FormLabel>
                    <FormControl
                    type="text"
                    name="currentPassword"
                    placeholder="currentPassword"
                    onChange={this.handleChange}
                    value={this.state.currentPassword}
                    className="input1 col-xl-8 m-2 border border-dark"
                    />
                </FormGroup >
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">newPassword</FormLabel>
                    <FormControl
                    type="text"
                    name="newPassword"
                    value={this.state.newPassword}
                    onChange={this.handleChange}
                    placeholder="newPassword"
                    className="input col-xl-8 m-2 border border-dark"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">confirmPassword</FormLabel>
                    <FormControl
                    type="text"
                    name="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    placeholder="confirmPassword"
                    className="input col-xl-8 m-2 border border-dark"
                    />
                </FormGroup>
                {/* <p id="login" className="warning"/> */}
                <Button className="m-2" onClick={() => this.handleSubmit()}>Updatepassword</Button>
                <Button className="m-2" onClick={this.props.history.goBack}>Cancel</Button>
                {/* <Button className="m-2" onClick={() => this.props.history.goback()}>
                    Cancel
                </Button> */}
                </div>

            </div>
                <div className="text-center m-2 mb-5">
                    <button className="btn btn-secondary mb-5" onClick={this.props.history.goBack}>Back</button>
                </div>
      </div>
      </div>
        )
    }
}

export default withRouter(UpdatePassword)
