import {Component} from 'react'
import {withRouter} from 'react-router-dom'


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
            <div className="text-center container">
                <h1 className="m-3">Rajiv Gandhi University Of Knowledge Technologies , Basar</h1>
                <button onClick={()=>{
                        localStorage.setItem('role',"student")
                        this.props.history.push('/login')
                    }}  className="btn btn-primary col-md-4 m-3">Log in as Student</button>
                <button onClick={()=>{
                        localStorage.setItem('role',"teacher")
                        this.props.history.push('/login')
                    }}  className="btn btn-primary col-md-4 m-3">Log in as Faculty</button>
            </div>
        )
    }
}
export default withRouter(Home);