import React, {Component} from 'react';
import './Login.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import openModal from '../../actions/openModal';
import SignUp from './SignUp';
import axios from 'axios';
import swal from 'sweetalert';
import regAction from '../../actions/regAction';


class Login extends Component{
    constructor(){
        super();
        
        this.state ={
            email: "",
            password: ""
        }
    }


    changeEmail=(e)=>{
        this.setState({
            email: e.target.value
        })
    }

    changePassword=(e)=>{
        this.setState({
            password: e.target.value
        })
    }


    submitLogin = async(e)=>{
        e.preventDefault();
        
        const url = `${window.apiHost}/users/login`
        const data = {
            email: this.state.email,
            password: this.state.password
        }

        const resp = await axios.post(url, data);
        
        const message = resp.data.msg
        

        if(message === "loggedIn"){
            swal({
                title: "Success",         
                icon: "success",
            });
        }

        else if(message === "noEmail"){
            swal({
                title: "Invalid email",
                text: "The email is not valid",         
                icon: "error",
            });
        }

        else if(message === "badPass"){
            swal({
                title: "Invalid password",
                text: "Wrong password",
                icon: "error",
            });
        }
        this.props.regAction(resp.data)
        

    }

    render(){
        return(
            <div className="login-form">
                <form onSubmit={this.submitLogin}>
                    <button className="facebook-login">Connect With Facebook</button>
                    <button className="google-login">Connect With Google</button>
                    <div className="login-or center">
                        <span>or</span>
                        <div className="or-divider"></div>
                    </div>
                    <input onChange={this.changeEmail} type="text" className="browser-default" placeholder="Email address" />
                    <input onChange={this.changePassword}  type="password" className="browser-default" placeholder="Password" />
                    <button className="sign-up-button">Login</button>
                    <div className="divider"></div>
                    <div>Don't have an account? <span className="pointer" onClick={()=>{this.props.openModal('open', <SignUp />)}}> Sign up</span></div>
                </form>
            </div>
        )
    }

}



function mapStateToProps(state){
    return{
        auth:state.auth
    }
}

function mapDispatchToProps(dispatcher){
    return bindActionCreators({
        openModal: openModal,
        regAction: regAction
    },dispatcher)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)