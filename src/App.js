// import logo from './logo.svg';
import './App.css';
import {HashRouter as Router,Route,Switch} from 'react-router-dom'
import {Offline, Online} from 'react-detect-offline'
import Home from './components/Home';
import {Component} from 'react'
import Student from './components/Student';
import Login from './components/Login';
import Register from './components/Register';
import TeacherRegister from './components/TeacherRegister';
import Dashboard from './components/Dashboard';
import TeacherDashboard from './components/TeacherDashboard'
import './docs/css/header.css'
import Course from './components/Course';
import UpdateStudent from './components/UpdateStudent';
import UpdateTeacher from './components/UpdateTeacher';
import UpdateTeacherPassword from './components/UpdateTeacherPassword';
import UpdatePassword from './components/UpdatePassword';
import CreateTest from './components/CreateTest';
import ViewTest from './components/ViewTest';
import EditTest from './components/EditTest';
import StudentViewTest from './components/StudentViewTest';
import StudentCourse from './components/StudentCourse'
import AttempTest from './components/AttempTest';
import StudentReview from './components/StudentReview';
import ViewSubmissions from './components/ViewSubmissions';
import ReviewTest from './components/ReviewTest';
import ViewProfile from './components/ViewProfile';
import TeacherProfile from './components/TeacherProfile';
import ForgotPassword from './components/ForgotPassword';


class App extends Component {

  // componentDidMount = ()=>{
  //   window.addEventListener("beforeunload",this.clearDetails);
  // }

  // componentWillUnmount = ()=>{
  //   alert("hello");
  //   // if(window.confirm("Do you want to close?")){
  //   //   return true;
  //   // }
  //   // else{
  //   //   return false;
  //   // }
  //   // if(localStorage.getItem('token')){
      
  //   // }
  //   window.removeEventListener("beforeunload",this.clearDetails);
  // }

  // clearDetails = (ev)=>{
  //   console.log(ev);
  //   // ev.preventDefault();
  //   // alert("fdgfgd");
  //   console.log("ggg");
  //   fetch("https://online-exam-back.herokuapp.com/course/add",{
  //       method : 'post',
  //       body : JSON.stringify({
  //         courseId : "CS3002",
  //         courseName : "CN",
  //         credits : 3
  //       }),
  //       headers : {
  //           'Content-type' : 'application/json',
  //           // Authorization : localStorage.getItem('token')
  //       }
  //     }).then(res=>res.json())
  //     .then(res=>{
  //       console.log(res);
  //       if(res.msg==="Course Created Susscesfully"){
  //          alert("success");
  //       }
  //     })
  //     console.log("not logged out");
  //     var i;
  //     for(i=0;i<500000000000;i++){
  //       // console.log("1");
  //     }
  //   return ev.returnValue = "are you sure you want to close?";
  //   // return "are you sure you want to close?";
  // }

  render(){
    
      return (
        <div>
          <Online>
          <Router>
              <div>
                <Switch>
                  <Route exact path="/">
                    <Home></Home>
                  </Route>
                  <Route exact path="/student">
                    <Student></Student>
                  </Route>
                  <Route exact path="/login">
                    <Login/>
                  </Route>
                  <Route exact path="/student/register">
                    <Register/>
                  </Route>
                  <Route exact path="/teacher/register">
                    <TeacherRegister/>
                  </Route>
                  <Route exact path="/student/dashboard">
                    <Dashboard/>
                  </Route>
                  <Route exact path="/teacher/dashboard">
                    <TeacherDashboard/>
                  </Route>
                  <Route exact path="/teacher/ViewProfile">
                    <TeacherProfile/>
                  </Route>
                  <Route exact path="/teacher/updateProfile">
                    <UpdateTeacher/>
                  </Route>
                  <Route exact path="/teacher/updatePassword">
                    <UpdateTeacherPassword/>
                  </Route>
                  <Route exact path="/teacher/course">
                    <Course/>
                  </Route>
                  <Route exact path="/student/course">
                    <StudentCourse/>
                  </Route>
                  <Route exact path="/student/updateProfile">
                    <UpdateStudent/>
                  </Route>
                  <Route exact path="/student/ViewProfile">
                    <ViewProfile/>
                  </Route>
                  <Route exact path="/teacher/createTest">
                    <CreateTest/>
                  </Route>
                  <Route exact path="/teacher/viewTest">
                    <ViewTest/>
                  </Route>
                  <Route exact path="/teacher/viewSubmissions">
                    <ViewSubmissions/>
                  </Route>
                  <Route exact path="/teacher/reviewTest">
                    <ReviewTest/>
                  </Route>
                  <Route exact path="/teacher/editTest">
                    <EditTest/>
                  </Route>
                  <Route exact path="/student/viewTest">
                    <StudentViewTest/>
                  </Route>
                  <Route exact path="/student/attemptTest">
                    <AttempTest/>
                  </Route>
                  <Route exact path="/student/updatePassword">
                    <UpdatePassword/>
                  </Route>
                  <Route exact path="/student/review">
                    <StudentReview/>
                  </Route>
                  <Route exact path="/forgotPassword">
                    <ForgotPassword/>
                  </Route>
                </Switch>
              </div>
            </Router>
          </Online>
          <Offline>
            <div className="text-center">
              <h1>Connection Lost </h1>
              <h3>Please check yout Internet Connection</h3>
            </div>
          </Offline>
        </div>
            
      );
    }
}

export default App;
