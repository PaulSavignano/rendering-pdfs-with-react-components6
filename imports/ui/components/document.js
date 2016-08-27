import React from 'react';
import InlineCss from 'react-inline-css'
import { ListGroupItem, FormControl, Button } from 'react-bootstrap';
import fileSaver from 'file-saver'
import { Bert } from 'meteor/themeteorchef:bert';
import { removeDocument } from '../../api/documents/methods.js';
import { Meteor } from 'meteor/meteor'
import { base64ToBlob } from '../../modules/base64-to-blob'

const downloadPDF = (event) => {
  event.preventDefault()
  const { target } = event
  const documentId = target.getAttribute('data-id')
  target.innerHTML = '<em>Downloading...</em>'
  target.classList.add('downloading')
  Meteor.call('documents.download', { documentId }, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger')
    } else {
      const blob = base64ToBlob(response.base64)
      fileSaver.saveAs(blob, response.fileName)
      target.innerHTML = 'Download'
      target.classList.remove('downloading')
    }
  })
}

const handleRemoveDocument = (documentId, event) => {
  event.preventDefault()
  removeDocument.call({
    _id: documentId,
  }, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger')
    } else {
      Bert.alert('Document removed!', 'success')
    }
  })
}

export const Document = ({ document }) => (
  <InlineCss stylesheet={`
    img {
    max-width: 100px
    }
    @media print {
    .Document {
    display: block;
    border: 1px solid red;
    padding: 20px;
    }
    .btn { display: none }
    hr { display: none }
    h3 {
    font-size: 28px;
    margin-top: 0px;
    margin-bottom: 0px
    }
    p {
    margin-top: 10px;
    margin-bottom: 0px;
    font-size: 18px;
    }
    img {
    max-width: 100px
    }
    }
  `}>
    <ListGroupItem className="Document">
      <Button data-id={ document._id } onClick={ downloadPDF } bsStyle="success">Download</Button>
      <Button onClick={ handleRemoveDocument.bind(this, document._id) } bsStyle="danger">Remove</Button>
      <hr/>
      <h3>{ document.title }</h3>
      <p>{ document.body }</p>
      <img src={ document.image } />
    </ListGroupItem>
  </InlineCss>
)

Document.propTypes = {
  document: React.PropTypes.object.isRequired,
}
