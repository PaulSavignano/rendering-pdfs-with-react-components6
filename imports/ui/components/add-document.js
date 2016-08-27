import React, { Component } from 'react'
import { FormGroup, FormControl, Button } from 'react-bootstrap'
import { insertDocument } from '../../api/documents/methods'
import { Bert } from 'meteor/themeteorchef:bert'

export class AddDocument extends Component {
  constructor(props) {
    super(props)
    this.state = { file: '', imagePreviewUrl: ''}
  }
  handleImageChange(event) {
    event.preventDefault()
    const fileReader = new FileReader()
    console.log(fileReader)
    const file = event.target.files[0]
    fileReader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: fileReader.result,
      })
    }
    const readResult = fileReader.readAsDataURL(file)
    return readResult
  }
  handleInsertDocument(event) {
    event.preventDefault()
    const title = document.querySelector('[name="title"]')
    const body = document.querySelector('[name="body"]')
    const image = this.state.imagePreviewUrl
    if (title.value.trim() !== '' && body.value.trim() !== '' && image.length !== 0) {
      insertDocument.call({
        title: title.value,
        body: body.value,
        image
      }, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger')
        } else {
          title.value = ''
          body.value = ''
          Bert.alert('Document added', 'success')
        }
      })
    } else {
      Bert.alert('Both a title, body, and image are required.', 'danger')
    }
  }
  render() {
    const { imagePreviewUrl } = this.state
    let imagePreview = null
    if (imagePreviewUrl) {
      imagePreview = (
        <img src={ imagePreviewUrl } />
      )
    } else {
      imagePreview = ''
    }
    return (
      <form onSubmit={ this.handleInsertDocument.bind(this) } className="AddDocument">
        <FormGroup>
          <FormControl
            name="title"
            type="text"
            placeholder="Enter a title."
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            name="body"
            componentClass="textarea"
            placeholder="Enter a body for the pdf."
          />
        </FormGroup>
        <FormGroup>
          <div className="imagePreview">
            { imagePreview }
          </div>
          <FormControl
            onChange={ this.handleImageChange.bind(this) }
            type="file"
            name="image"
          />
        </FormGroup>
        <Button type="submit" bsStyle="success">Add Document</Button>
      </form>
    )
  }
}
