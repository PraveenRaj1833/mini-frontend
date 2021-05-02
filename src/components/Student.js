import {Component} from 'react'
import {withRouter} from 'react-router-dom'


class Student extends Component{
    constructor(props){
        super(props);
        this.state={
            name:''
        }
        
    }
   
   
   
    render()
    {
        return (
            <div className="text-center">
                <h1>hello</h1>
                
                <button  onClick={()=>this.props.history.goBack()} className="btn btn-primary">Go back</button>
            </div>
        )
    }
}
export default withRouter(Student);