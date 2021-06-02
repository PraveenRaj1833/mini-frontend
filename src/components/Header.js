import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Carousel,Navbar,Nav,NavDropdown,OverlayTrigger,Popover,Button} from 'react-bootstrap'
import '../docs/css/dashboard.css'

class Header extends Component {

    logout = ()=>{
        //console.log("logout called");
        if(window.confirm("Do you want to logout?")){
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    render() {
        const role= localStorage.getItem("role");
        const user = JSON.parse(localStorage.getItem('user'));
        const popover = (
            <Popover id="popover-basic">
              <Popover.Title as="h3">{localStorage.getItem("role")==="student"?"Student":"Teacher"} Details</Popover.Title>
              <Popover.Content>
                <b className="h5">{role==="student"?user.studentId:user.teacherId}</b> <br/>
                {user.name} <br/>
                <Button onClick={()=>this.props.history.push(`/${role}/ViewProfile`)} className="w-100 m-1">View Profile</Button>
                <Button onClick={()=>this.props.history.push(`/${role}/updateProfile`)} className="w-100 m-1">Edit Profile</Button>
                <Button onClick={()=>this.props.history.push(`/${role}/updatePassword`)} className="w-100 m-1"> Edit Password </Button>
              </Popover.Content>
            </Popover>
          );

        return (
            <div id="dh" className="home-header-section">
                    
                { 
                
                (localStorage.getItem('token'))?<span>
                
                <OverlayTrigger trigger="click" placement="bottom" className="float-right inline mt-2 mr-2 border border-1" overlay={popover}>
                    <Button variant="success" className="float-right inline mt-2 mr-2 border border-1"><i class="user icon"></i></Button>
                </OverlayTrigger>

                <button className="float-right mr-2 mt-2 inline btn btn-success border border-1 green" onClick={()=>this.logout()}>Logout</button>
                <button className="small ui icon button float-right mr-2 btn-success green notify mt-2 border border-1" width="20" height="20">
                    <i className="bell icon " ></i>
                </button>
                </span>:
                <span>
                    <button className="float-right mr-2 mt-2 inline btn btn-success border border-1" onClick={()=>this.props.history.push('/register')}>Register</button>
                    <button className="float-right mr-2 mt-2 inline btn btn-success border border-1" onClick={()=>this.props.history.push('/login')}>Login</button>
                </span>
                }
                <h1 className="inline set-headings ">Online {window.innerWidth>410?"Examination":"EMS"}</h1>
                {/* <h3 id="head-of-a1" className="mt-1">Examination</h3> */}
            </div>
        )
    }
}

export default withRouter(Header)
