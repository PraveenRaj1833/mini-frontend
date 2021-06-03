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

class UpdateStudent extends Component {

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
            role : 'student',
            gender : '' ,
            year : '' ,
            class : '' ,
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
        // var mobileRegex=/^[5-9][0-9]{9}$/;
        let regexEmail=/^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+)\.([a-z]{2,20})(.[a-z]{2,20})?$/;
        // let regexPassword=/^(?=.?[A-Za-z])(?=.?[0-9]).{8,20}$/;
        let regexPhn=/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if(this.state.name.trim()===""){
            alert("Name cannot be empty!");
            f=1;
        }
        else if(this.state.email.trim()===""){
            alert("Email cannot be empty!");
            f=1;
        }  
        else if(!regexEmail.test(this.state.email.trim())){
            alert(" Enter a valid Email address!");
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
        else if(!regexPhn.test(this.state.phone.trim())){
            alert(" Enter a valid Mobile number!");
            f=1;
        }
        else if(this.state.gender.trim()===""){
            alert("gender cannot be empty!");
            f=1;
        }
        else if(this.state.class.trim()===""){
            alert("class cannot be empty!");
            f=1;
        }
        else if(this.state.year.trim()===""){
            alert("Year cannot be empty!");
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
        else if(this.state.pincode.toString().trim()===""){
            alert("Pincode cannot be empty!");
            f=1;
        }

        if(f===0){
            this.setState({
                loader : true
            });
            const role = localStorage.getItem('role')
            fetch(`https://online-exam-back.herokuapp.com/student/updateStudent`,{
                method : 'post',
                headers : {
                    'Content-Type': 'application/json',
                    Authorization : localStorage.getItem('token')
                },
                body : JSON.stringify({
                    studentId : this.state.studentId,
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
                    year : this.state.year,
                    class : this.state.class,
                    password : this.state.password
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
            <div id="tfbb">
            <div id="tfb" className="text-center mt-5">
                
                 {this.state.loader?<Spinner></Spinner>:null}
            <div id="tform" className="form  col-xl-4 col-lg-5 col-md-6 col-sm-8 col-10 m-auto my-auto">
                {/* col-xl-5 col-lg-6 col-md-7 col-sm-8 col-10 */}
                <h1 className="m-3 mb-4">{localStorage.getItem('role')==='student'?"Student":"Faculty"} Update</h1>
                <div>
                <FormGroup className="form-inline ">
                    <FormLabel className="form-label">studentId</FormLabel>
                    <FormControl
                    type="text"
                    name="studentId"
                    disabled = {true}
                    placeholder="studentId"
                    onChange={this.handleChange}
                    value={this.state.studentId}
                    className="input1 col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
                    />
                </FormGroup>
                {/* <FormGroup className="form-inline">
                    <FormLabel className="form-label">role</FormLabel>
                    <FormControl
                    type="text"
                    name="role"
                    disabled = {true}
                    value={this.state.role}
                    onChange={this.handleChange}
                    placeholder="role"
                   // <select value={this.state.role} onChange={this.handleChange}> 
                   // <option value="male"> male</option>
                   // <option value="female">female</option>
                   // </select>
                    className="input col-xl-8 m-2 border border-dark"
                    />
                </FormGroup> */}
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">gender</FormLabel>
                    <FormControl
                    type="text"
                    name="gender"
                    value={this.state.gender}
                    onChange={this.handleChange}
                    placeholder="gender"
                    className="input col-xl-8 m-2 border border-dark"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">year</FormLabel>
                    <FormControl
                    type="text"
                    name="year"
                    value={this.state.year}
                    onChange={this.handleChange}
                    placeholder="year"
                    className="input col-xl-8 m-2 border border-dark"
                    />
                </FormGroup>
                <FormGroup className="form-inline">
                    <FormLabel className="form-label">class</FormLabel>
                    <FormControl
                    type="text"
                    name="class"
                    value={this.state.class}
                    onChange={this.handleChange}
                    placeholder="class"
                    className="input col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
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
                    className="input col-xl-8 m-2 border border-dark"
                    />
                </FormGroup>
                <p id="login" className="warning"/>
                <Button className="m-2" onClick={() => this.handleSubmit()}>Update</Button>
                <Button className="m-2" onClick={this.props.history.goBack}>Cancel</Button>
                {/* <Button className="m-2" onClick={() => this.props.history.goBack}>
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

export default withRouter(UpdateStudent)
