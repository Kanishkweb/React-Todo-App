import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useState } from 'react';
import { updateDoc,doc, query, collection, where, getDocs, QuerySnapshot } from 'firebase/firestore';
import db from '../Firebase';
import { useEffect } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
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
            if(docId) {
                const todoRef = doc(db,'todos',docId);
                await updateDoc(todoRef,{
                    todo:editedText,
                });
                console.log('TodoUpdated in FireBase',editedText)
                closeModal();
            }
        } catch (error) {
            console.log(error)
        }
    }
    const [docId, setDocId] = useState(null)
    useEffect(() => {
        const getDocumentId = async () => {
            const q = query(
                collection(db,'todos'),
                where('todo','==',todoText)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setDocId(doc.id);
            });
        };

        getDocumentId();
    }, [todoText])
    


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
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                        Edit Todo
                    </Typography>
                    <form onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            value={editedText}
                            onChange={handleTextChange}
                            placeholder="Edit your todo..."
                        />
                        <Button type="submit" onClick={handleEditFormSubmit}>Save</Button>
                        <Button onClick={closeModal}>Cancel</Button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
}
