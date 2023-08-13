import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import the necessary components
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useState } from 'react';
import { updateDoc, doc, query, collection, where, getDocs } from 'firebase/firestore';
import db from '../Firebase';
import { useEffect } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: '180px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundImage: 'linear-gradient(135deg, #ffffff, #f0f0f0)', // White theme gradient
    color: '#333', // Dark gray font color for better contrast
    fontFamily: 'Arial, sans-serif',
    fontSize: '1.5rem', // Increased font size
};

export default function TransitionsModal({ open, closeModal, todoText }) {
    const [editedText, setEditedText] = useState(todoText);

    const handleTextChange = (event) => {
        setEditedText(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log('Updated todo:', editedText);
        setEditedText(editedText)
        // Handle updating the todo using editedText value
        closeModal()
    };

    const handleEditFormSubmit = async () => {
        try {
            if (docId) {
                const todoRef = doc(db, 'todos', docId);
                await updateDoc(todoRef, {
                    todo: editedText,
                });
                console.log('TodoUpdated in FireBase', editedText)
                closeModal();
                toast.success('Todo Edit successfully!', {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 2000, // Duration in milliseconds
                });
            }
        } catch (error) {
            toast.error('An error occurred while Editing the todo. Please try again later.', {
                position: toast.POSITION.BOTTOM_LEFT,
            });
        }
    }
    const [docId, setDocId] = useState(null)
    useEffect(() => {
        const getDocumentId = async () => {
            const q = query(
                collection(db, 'todos'),
                where('todo', '==', todoText)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setDocId(doc.id);
            });
        };

        getDocumentId();
    }, [todoText])

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
    };

    const inputStyle = {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '100%',
        fontSize: '1rem',
        marginBottom: '10px',
    };

    const buttonStyle = {
        background: '#ff6b6b',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        marginRight: '10px',
    };

    const cancelButtonStyle = {
        background: 'none',
        color: '#333',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    };
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography id="transition-modal-title" variant="h6" component="h2" style={{ fontSize: '1.5rem' }}>
                        Edit Todo
                    </Typography>
                    <form onSubmit={handleFormSubmit} style={formStyle}>
                        <input
                            type="text"
                            value={editedText}
                            onChange={handleTextChange}
                            placeholder="Edit your todo..."
                            style={inputStyle}
                        />
                        <div style={{ display: 'flex' }}>
                            <Button type="submit" onClick={handleEditFormSubmit} style={buttonStyle}>Save</Button>
                            <Button onClick={closeModal} style={cancelButtonStyle}>Cancel</Button>
                        </div>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
}
