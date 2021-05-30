import {Component} from 'react'
import {withRouter} from 'react-router-dom'
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
                <h1 id="headi" className="m-3">Onilne Examination Management System</h1>
                <br/>
                <br/>
                <button onClick={()=>{
                        localStorage.setItem('role',"student")
                        this.props.history.push('/login')
                    }}  className="btn btn-primary col-md-4 m-3 border border-2"> as Student</button>
                <button onClick={()=>{
                        localStorage.setItem('role',"teacher")
                        this.props.history.push('/login')
                    }}  className="btn btn-primary col-md-4 m-3 border border-2"> as Faculty</button>
            </div>
        )
    }
}
export default withRouter(Home);