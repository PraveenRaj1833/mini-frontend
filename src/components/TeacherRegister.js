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

class TeacherRegister extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             teacherId : '',
             name : '',
             email : '',
             branchId : '',
             houseNo : '',
             city : '',
             district : '',
             state : '',
             pincode : '',
             phone : '' ,
             role : '',
             gender : '' ,
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
        var f=0;
        if(this.state.teacherId.trim()===""){
            alert("Teacher Id cannot be empty!");
            f=1;
        }
        else if(this.state.name.trim()===""){
            alert("Name cannot be empty!");
            f=1;
        }
        else if(this.state.email.trim()===""){
            alert("Email cannot be empty!");
            f=1;
        }  
        else if(this.state.branchId.trim()===""){
            alert("Branch Name cannot be empty!");
            f=1;
        }
        else if(this.state.phone.trim()===""){
            alert("Phone Number cannot be empty!");
            f=1;
        }
        else if(this.state.role.trim()===""){
            alert("Role cannot be empty!");
            f=1;
        }
        else if(this.state.gender.trim()===""){
            alert("gender cannot be empty!");
            f=1;
        }
        else if(this.state.password.trim()===""){
            alert("password cannot be empty!");
            f=1;
        }
        else if(this.state.houseNo.trim()===""){
            alert("House no. cannot be empty!");
            f=1;
        }
        else if(this.state.city.trim()===""){
            alert("City Name cannot be empty!");
            f=1;
        }
        else if(this.state.district.trim()===""){
            alert("District Name cannot be empty!");
            f=1;
        }
        else if(this.state.state.trim()===""){
            alert("State Name cannot be empty!");
            f=1;
        }
        else if(this.state.pincode.trim()===""){
            alert("Pincode cannot be empty!");
            f=1;
        }

        if(f===0){
        this.setState({
            loader : true
        });
        }
        const role = localStorage.getItem('role')
        fetch(`https://online-exam-back.herokuapp.com/teacher/add`,{
            method : 'post',
            body : JSON.stringify({
                teacherId : this.state.teacherId,
                name : this.state.name,
                email : this.state.email,
                branchId : this.state.branchId,
                houseNo : this.state.houseNo,
                city : this.state.city,
                district : this.state.district,
                state : this.state.state,
                pincode : this.state.pincode,
                phone : this.state.phone,
                role : this.state.role,
                gender : this.state.gender,
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
              alert("registered successfully")
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
                <h1 className="m-3 mb-4">{localStorage.getItem('role')==='student'?"Student":"Faculty"} Register</h1>
                <div>
                <FormGroup className="form-inline ">
                    <FormLabel className="form-label">teacherId</FormLabel>
                    <FormControl
                    type="text"
                    name="teacherId"
                    placeholder="teacherId"
                    onChange={this.handleChange}
                    value={this.state.teacherId}
                    className="input1 col-xl-8 m-2"
                    />
                </FormGroup >
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">name</FormLabel>
                    <FormControl
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    placeholder="name"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">email</FormLabel>
                    <FormControl
                    type="text"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder="email"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">branchId</FormLabel>
                    <FormControl
                    type="text"
                    name="branchId"
                    value={this.state.branchId}
                    onChange={this.handleChange}
                    placeholder="branchId"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">phone</FormLabel>
                    <FormControl
                    type="text"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.handleChange}
                    placeholder="phone"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">role</FormLabel>
                    <FormControl
                    type="text"
                    name="role"
                    value={this.state.role}
                    onChange={this.handleChange}
                    placeholder="role"
                   // <select value={this.state.role} onChange={this.handleChange}> 
                   // <option value="male"> male</option>
                   // <option value="female">female</option>
                   // </select>
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">gender</FormLabel>
                    <FormControl
                    type="text"
                    name="gender"
                    value={this.state.gender}
                    onChange={this.handleChange}
                    placeholder="gender"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
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
                <FormLabel  className="h4 form-label">Address</FormLabel>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">houseNo</FormLabel>
                    <FormControl
                    type="text"
                    name="houseNo"
                    value={this.state.houseNo}
                    onChange={this.handleChange}
                    placeholder="houseNo"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">city</FormLabel>
                    <FormControl
                    type="text"
                    name="city"
                    value={this.state.city}
                    onChange={this.handleChange}
                    placeholder="city"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">district</FormLabel>
                    <FormControl
                    type="text"
                    name="district"
                    value={this.state.district}
                    onChange={this.handleChange}
                    placeholder="district"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">state</FormLabel>
                    <FormControl
                    type="text"
                    name="state"
                    value={this.state.state}
                    onChange={this.handleChange}
                    placeholder="state"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">pincode</FormLabel>
                    <FormControl
                    type="text"
                    name="pincode"
                    value={this.state.pincode}
                    onChange={this.handleChange}
                    placeholder="pincode"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <p id="login" className="warning"/>
                <Button className="m-2" onClick={() => this.handleSubmit()}>Register</Button>
                <Button className="m-2" onClick={() => this.props.history.goback()}>
                    Cancel
                </Button>
                </div>

            </div>
                <div className="text-center m-2 mb-5">
                    <button className="btn btn-secondary mb-5" onClick={this.props.history.goBack}>Back</button>
                </div>
      </div>
        )
    }
}

export default withRouter(TeacherRegister)
