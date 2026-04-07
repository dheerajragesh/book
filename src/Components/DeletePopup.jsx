// DeletePopup.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeletePopup = ({ show, handleClose, handleConfirm, itemName }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body className="border-0">
        Are you sure you want to delete <strong>{itemName}</strong>?
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePopup;