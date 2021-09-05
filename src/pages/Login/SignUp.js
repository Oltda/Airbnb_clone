import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import openModal from '../../actions/openModal';
import Login from './Login';
import './Login.css'
import axios from 'axios';
import swal from 'sweetalert';
import regAction from '../../actions/regAction';

class SignUp extends Component{
    
    constructor(){
        super();
        this.state = {
            lowerPartOfForm:  <button type="button" onClick={this.showInputs} className="sign-up-button">Sign up with email</button>
        }
    }

    changeEmail = (e)=>this.setState({email:e.target.value})
    changePassword = (e)=>this.setState({password:e.target.value})


    showInputs = ()=>{
        this.setState({
            lowerPartOfForm: <SignUpInputFields 
                changeEmail={this.changeEmail} 
                changePassword={this.changePassword} 
                />
        })
    }


    submitLogin = async(e)=>{
        e.preventDefault();
        const url = `${window.apiHost}/users/signup`
        const data = {
            email: this.state.email,
            password: this.state.password
        }
        const resp = await axios.post(url, data);
        const token = resp.data.token

        if(resp.data.msg === 'userExists'){
            swal({
                title: "Email exists",
                text: "The email is already registered, try another",
                icon: "error",
            })
        }else if(resp.data.msg === 'invalidData'){
            swal({
                title: "Invalid email/password",
                text: "Please provide a valid password email",
                icon: "error",
            })
        }else if(resp.data.msg === "userAdded"){
            swal({
                title: "Success",         
                icon: "success",
            });
            this.props.regAction(resp.data);
        }


        // const url2 = `${window.apiHost}/users/token-check`;
        // const resp2 = await axios.post(url2,{token});
        // console.log(resp2)

    }



    render(){

        console.log(this.props.auth);

        return(
            <div className="login-form">
                <form onSubmit={this.submitLogin}>
                    <button className="facebook-login">Connect With Facebook</button>
                    <button className="google-login">Connect With Google</button>
                    <div className="login-or center">
                        <span>or</span>
                        <div className="or-divider"></div>
                    </div>
                   {this.state.lowerPartOfForm}
                    <div className="divider"></div>
                
                    <div>Already have an account?  <span className="pointer" onClick={()=>{this.props.openModal('open', <Login />)}}> Log in</span></div>

                </form>
            </div>

        )
    }

}


function mapStateToProps(state){
   
    return{
        auth: state.auth
    } 
}


function mapDispatchToProps(dispatcher){
    return bindActionCreators({
        openModal: openModal,
        regAction: regAction
    },dispatcher)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)





const SignUpInputFields = (props)=>{
    return(
        <div className="sign-up-wrapper">
            <div className="col m12">
                <div className="input-field" id="mail">
                    <div className="form-label">Email</div>
                    <input type="text" placeholder="Email" onChange={props.changeEmail} />
                </div>
            </div>
            <div className="col m12">
                <div className="input-field" id="Password">
                    <div className="form-label">Password</div>
                    <input type="password" placeholder="Password" onChange={props.changePassword} />
                </div>
            </div>
            <div className="col m12">
                <button type="submit" className="btn red accent-2">Signup</button>
            </div>
        </div>
    )
}