import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Button} from 'react-bootstrap';
import '../docs/css/home.css'


class Home extends Component{
    constructor(props){
        super(props);
        this.state={
            name:''
        }
        
    }  

    componentDidMount = ()=>{
        console.log("hom4");
        localStorage.clear();
    }
   
    render()
    {
        return (
            <div id="home" className="text-center">
                <span id="headi" className="m-3">Onilne Examination Management System</span>
                <br/>
                <br/>
                <Button onClick={()=>{
                        localStorage.setItem('role',"student")
                        this.props.history.push('/login')
                    }}  className="homebtn btn btn-primary col-8 col-sm-6 col-md-4 col-lg-4 col-xl-4 border border-2 p-2"> As a Student</Button>
                <Button onClick={()=>{
                        localStorage.setItem('role',"teacher")
                        this.props.history.push('/login')
                    }}  className="homebtn btn btn-primary col-8 col-sm-6 col-md-4 col-lg-4 col-xl-4 border border-2 p-2"> As a Faculty</Button>
            </div>
        )
    }
}
export default withRouter(Home);