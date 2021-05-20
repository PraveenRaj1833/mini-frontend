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

class ViewProfile extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            studentId : '',
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
            year : '' ,
            class : '' ,
            loader : false
        }
    }

    componentDidMount = ()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        this.setState({
            studentId : user.studentId,
            name : user.name,
            email : user.email,
            branchId : user.branchId,
            houseNo : user.address.houseNo,
            city : user.address.city,
            district : user.address.district,
            state : user.address.state,
            pincode : user.address.pincode,
            phone : user.phone ,
            role : user.role,
            gender : user.gender ,
            year : user.year ,
            class : user.class 
        })
    }

    render() {
        return (
            <div className="text-center mt-5">
                
                 {this.state.loader?<Spinner></Spinner>:null}
            <div className="form  col-xl-4 col-lg-5 col-md-6 col-sm-8 col-10 m-auto my-auto">
                {/* col-xl-5 col-lg-6 col-md-7 col-sm-8 col-10 */}
                <h1 className="m-3 mb-4">{localStorage.getItem('role')==='student'?"Student":"Faculty"} Profile</h1>
                <div>
                <FormGroup className="form-inline ">
                    <FormLabel className="form-label">studentId</FormLabel>
                    <FormControl
                    type="text"
                    name="studentId"
                    disabled = {true}
                    placeholder="studentId"
                    // onChange={this.handleChange}
                    value={this.state.studentId}
                    className="input1 col-xl-8 m-2"
                    />
                </FormGroup >
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">name</FormLabel>
                    <FormControl
                    type="text"
                    name="name"
                    disabled={true}
                    value={this.state.name}
                   // onChange={this.handleChange}
                    placeholder="name"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">email</FormLabel>
                    <FormControl
                    type="text"
                    name="email"
                    disabled={true}
                    value={this.state.email}
                   // onChange={this.handleChange
                    placeholder="email"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">branchId</FormLabel>
                    <FormControl
                    type="text"
                    name="branchId"
                    disabled={true}
                    value={this.state.branchId}
                   // onChange={this.handleChange}
                    placeholder="branchId"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">phone</FormLabel>
                    <FormControl
                    type="text"
                    name="phone"
                    disabled={true}
                    value={this.state.phone}
                    //onChange={this.handleChange}
                    placeholder="phone"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">role</FormLabel>
                    <FormControl
                    type="text"
                    name="role"
                    disabled = {true}
                    value={this.state.role}
                    //onChange={this.handleChange}
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
                    disabled={true}
                    value={this.state.gender}
                    //onChange={this.handleChange}
                    placeholder="gender"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">year</FormLabel>
                    <FormControl
                    type="text"
                    name="year"
                    disabled={true}
                    value={this.state.year}
                    //onChange={this.handleChange}
                    placeholder="year"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">class</FormLabel>
                    <FormControl
                    type="text"
                    name="class"
                    disabled={true}
                    value={this.state.class}
                   // onChange={this.handleChange}
                    placeholder="class"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormLabel  className="h4 form-label">Address</FormLabel>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">houseNo</FormLabel>
                    <FormControl
                    type="text"
                    name="houseNo"
                    disabled={true}
                    value={this.state.houseNo}
                    //onChange={this.handleChange}
                    placeholder="houseNo"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">city</FormLabel>
                    <FormControl
                    type="text"
                    name="city"
                    disabled={true}
                    value={this.state.city}
                    //onChange={this.handleChange}
                    placeholder="city"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">district</FormLabel>
                    <FormControl
                    type="text"
                    name="district"
                    disabled={true}
                    value={this.state.district}
                   // onChange={this.handleChange}
                    placeholder="district"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">state</FormLabel>
                    <FormControl
                    type="text"
                    name="state"
                    disabled={true}
                    value={this.state.state}
                    //onChange={this.handleChange}
                    placeholder="state"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">pincode</FormLabel>
                    <FormControl
                    type="text"
                    name="pincode"
                    disabled={true}
                    value={this.state.pincode}
                    //onChange={this.handleChange}
                    placeholder="pincode"
                    className="input col-xl-8 m-2"
                    />
                </FormGroup>
                <p id="login" className="warning"/>
                {/* <Button className="m-2" onClick={() => this.handleSubmit()}>Update</Button> */}
                <Button className="m-1" onClick={()=>this.props.history.push('/student/updateProfile')}>Update Profile</Button>
                <Button className="m-1" onClick={()=>this.props.history.push('/student/updatePassword')}>Update Password</Button>
                </div>

            </div>
                <div className="text-center m-2 mb-5">
                    <button className="btn btn-secondary mb-5" onClick={this.props.history.goBack}>Back</button>
                </div>
      </div>
        )
    }
}

export default withRouter(ViewProfile)
