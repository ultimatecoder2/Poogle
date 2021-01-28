import React, { Component } from 'react'
import {Container, Row, Col,Button} from 'react-bootstrap';
import { Breadcrumb, BreadcrumbItem, Jumbotron } from "reactstrap";
import {Link} from 'react-router-dom'
import './add_forms.css'
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import {toolbarOptions, formats} from './text_editorVar';


const spaces = [{value:'AI',label:'Artificial Intelligence'}, 
    {value:'Frontend', label:'Frontend'}, 
    {value:'Backend', label:'Backend'}];

class addQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          description: '',
          title:'',
          category:'',
          errors:{
            description:'',
            category:'',
            title:''
          }


       } 
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this)
        this.handleSubmit= this.handleSubmit.bind(this)
      }
      modules = {
        toolbar:toolbarOptions
      }
      
      handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
          [name]: event.target.value
        });
      }
      handleMultiSelectChange = category => {
      this.setState({ category:category });
      }
      
      handleEditorChange(value) {
        this.setState({ description: value })
      }
      handleSubmit(event){
        event.preventDefault();
        const isValid = this.formValidation();
        console.log(this.state);
        
        if(isValid){
            window.alert("Form Submitted");
            
        }
        console.log(this.state);
      }
      
      formValidation = () =>{
        const{title, category,description} = this.state;
        let titleError="", categoryError = "", descriptionError="", error;
        if(!title.trim()){
            titleError = "Title is required";
            error = true;            
        }

        if(!category.length){
          categoryError = "You must select at least one category";
          error = true;            
        }
        
        if(!description.trim()|| !description.trim().length || description==="<p><br></p>"){
          descriptionError = "Description is required";
          error = true;            
        }
        
        this.setState(prevState => ({
            errors:{
                title:titleError,
                description: descriptionError,
                category:categoryError
            }
        }))
        
        return !error;
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
                                <BreadcrumbItem active>Add Question</BreadcrumbItem>
                            </Breadcrumb>
                        </Row>
                        <div>
                          <Jumbotron className='form-jumbotron'>
                            <Form>
                              <Form.Group controlId="formBasicEmail">
                                <Form.Label><span className="form__icon"></span>Title</Form.Label>
                                  <input name="title" className="form-control" type="text" value={this.state.title} placeholder="Enter Title" onChange={this.handleInputChange} />
                                    <div className="invalid__feedback">{this.state.errors.title}</div>
                              </Form.Group>

                              <Form.Group controlId="formBasicDropdown">
                                <Form.Label><span className="form__icon"></span>Choose Category</Form.Label>
                                <div><Select isMulti name="category" options={spaces} className="basic-multi-select" value={this.state.category} onChange={this.handleMultiSelectChange} classNamePrefix="select"/></div>
                                    <div className="invalid__feedback">{this.state.errors.category}</div>
                              </Form.Group>

                              <Form.Group>
                                <Form.Label><span className="form__icon"></span>Describe Here</Form.Label>
                                <ReactQuill theme="snow"  value={this.state.description} onChange={this.handleEditorChange} 
                                  style={{backgroundColor: 'white'}} modules={this.modules} formats= {formats}/>
                                  <div className="invalid__feedback">{this.state.errors.description}</div>
                              </Form.Group>
                              <Button onClick={this.handleSubmit} variant="info"><span className='fa fa-paper-plane mr-3' />Submit</Button>
                            </Form>
                          </Jumbotron>
                        </div>
                
                </Col>
                </Container>
            
          </div>
        )
      }
}
export default addQuestions