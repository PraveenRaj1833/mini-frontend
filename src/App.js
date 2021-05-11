// import logo from './logo.svg';
import './App.css';
import {HashRouter as Router,Route,Switch} from 'react-router-dom'
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
import { CreateTest } from './components/CreateTest';


class App extends Component {
  render(){
    
      return (
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
              <Route exact path="/teacher/updateProfile">
                <UpdateTeacher/>
              </Route>
              <Route exact path="/teacher/updateTeacherPassword">
                <UpdateTeacherPassword/>
              </Route>
              <Route exact path="/course">
                <Course/>
              </Route>
              <Route exact path="/student/updateProfile">
                <UpdateStudent/>
              </Route>
              <Route exact path="/teacher/createTest">
                <CreateTest/>
              </Route>
              <Route exact path="/student/updatePassword">
                <UpdatePassword/>
              </Route>
            </Switch>
          </div>
        </Router>
      );
    }
}

export default App;
