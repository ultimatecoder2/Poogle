import React, { Component } from 'react'
import {Container, Row, Col, Image} from 'react-bootstrap';
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import {Link, Redirect} from 'react-router-dom';
import {AiOutlineMail} from 'react-icons/ai';
import {RiLockPasswordFill} from 'react-icons/ri';
import './login_signup.css';
import GoogleIcon from '../../Images/google_color.svg';
import FacebookIcon from '../../Images/facebook_color.svg';
import {signIn} from '../../redux/ActionCreators';
import {connect} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:"",
            errors:{
                email:"",
                password:""
            },
            validated:false,
            authFailed: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
          [name]: event.target.value
        });
    }

    formValidation = () =>{
        const{email, password} = this.state;
        let emailError="", passwordError = "", error;
        if(!email){
            emailError = "Email is required";
            error = true;            
        }
        else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
        {
            emailError = "Email address is Invalid";
            error= true;
        }
        if(!password.trim())
        {
            passwordError="Password is required"
            error= true;
        }
        else if(password.length<5)
        {
            passwordError="Length of password must be 5 characters or more"
            error= true;
        }
        
        this.setState(prevState => ({
            errors:{
                email:emailError,
                password: passwordError
            }
        }))
        
        return !error;
    }


    notify = (message) => toast(message);

    handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = this.formValidation();
        this.setState({
            validated:isValid
        })
        if(isValid){
            const{email, password} = this.state;
            await this.props.signIn({email, password});
            
            if(this.props.auth.err)
            {
                this.notify(this.props.auth.err.message);
                this.notify("Login Unsuccesful!!");
            }    
            else 
            {
                this.notify("Login Succesful!!")

                setTimeout(() => {
                    let { from } = this.props.location.state || { from: { pathname: "/" } };
                    this.props.history.push(from.pathname);
                }, 5000);

            }    
        }
        console.log(this.state);
    }

    render() {

        return (
            <div className="forms__section">
                <Container>
                    <Col md={9} className="contact__main__content">
                        <Row>
                            <Breadcrumb className="mb-4 page__navigation__breadCrump">
                                <BreadcrumbItem>
                                    <Link to="/home">Home</Link>
                                </BreadcrumbItem>
                                <BreadcrumbItem active>Login</BreadcrumbItem>
                            </Breadcrumb>            
                        </Row>
                        <div>
                        <Jumbotron className="form__content__div form__content__div--login">
                            <Form validated={this.state.validated}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label><span className="form__icon"><AiOutlineMail/></span>Email address</Form.Label>
                                    <input name="email" className="form-control" type="email" value={this.state.name} placeholder="Enter email" onChange={this.handleInputChange} />
                                    <div className="invalid__feedback">{this.state.errors.email}</div>
                                </Form.Group>

                                <Form.Group controlId="formBasicTextbox">
                                    <Form.Label><span className="form__icon"><RiLockPasswordFill/></span>Password</Form.Label>
                                    <input name="password"  type="password" className="form-control"  value={this.state.name} placeholder="Enter password" onChange={this.handleInputChange} />
                                    <div className="invalid__feedback">{this.state.errors.password}</div>
                                </Form.Group>

                                <div className="form__btn">
                                    <button className="btn contact__form__button" type="submit" onClick={this.handleSubmit}>
                                        Submit
                                    </button>
                                </div>
                                <div className="form__other__text">
                                    New user? <Link to="/signup">Sign Up</Link>
                                </div>
                                
                                <div className="social-login-label">
                                    <span className="label-text">
                                        or connect with
                                    </span>
                                </div>
                                <div className="social__icons__container">
                                    <div className="social__icon__unique">
                                        <span className="social__icon">
                                           <Link to="#"><Image src={GoogleIcon}/></Link> 
                                        </span>
                                    </div>
                                    <div className="social__icon__unique">
                                        <span className="social__icon">
                                            <Link to="#"><Image src={FacebookIcon}/></Link> 
                                        </span>
                                    </div>
                                </div>
                            </Form>
                    
                        </Jumbotron>
                        </div>
                    </Col>
                </Container>
                <ToastContainer
                />
            </div>
        )
    }
}

const mapStateToProps = (state)=> {
    return {auth: state.auth};
}

export default connect(mapStateToProps,{signIn})(login);
