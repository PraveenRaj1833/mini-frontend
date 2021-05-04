// import logo from './logo.svg';
import './App.css';
import {HashRouter as Router,Route,Switch} from 'react-router-dom'
import Home from './components/Home';
import {Component} from 'react'
import Student from './components/Student';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './docs/css/header.css'
import Course from './components/Course';
import UpdateStudent from './components/UpdateStudent';


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
              <Route exact path="/register">
                <Register/>
              </Route>
              <Route exact path="/student/dashboard">
                <Dashboard/>
              </Route>
              <Route exact path="/course">
                <Course/>
              </Route>
              <Route exact path="/student/updateProfile">
                <UpdateStudent/>
              </Route>
            </Switch>
          </div>
        </Router>
      );
    }
}

export default App;
