import React, { useState } from 'react';
import { ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from './components/Modal'; // Make sure to import the correct path for your Modal component
import { deleteDoc, collection, getDocs } from 'firebase/firestore';
import db from './Firebase';
import './Todo.css'
function TodoItem(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // Delete the todo from Firestore
      const querySnapshot = await getDocs(collection(db, 'todos'));
      querySnapshot.forEach(async (doc) => {
        if (doc.data().todo === props.text) {
          await deleteDoc(doc.ref);
          console.log('Document deleted: ', props.text);
        }
      });
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };


  // Other functions (handleDelete, etc.)

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Directly open the modal when the "Edit" icon is clicked
  const handleEditClick = () => {
    openModal();
  };

  return (
    <div className="">
      <ListItem className="list">
        <Checkbox checked={props.completed} />
        <ListItemText primary={props.text} secondary="Dummy Deadline 🕗" />
        <IconButton edge="end" aria-label="edit" onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
      <Modal closeModal={closeModal} open={isModalOpen} todoText={props.text} />
    </div>
  );
}

export default TodoItem;