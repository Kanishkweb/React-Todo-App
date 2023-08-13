import React, { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify'; // Import the necessary components
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

import { Button } from '@mui/material';
import { FormControl, InputLabel, Input } from '@mui/material';
import Todo from './Todo';
import db from './Firebase';
import { collection,query, addDoc,onSnapshot, serverTimestamp,orderBy } from "firebase/firestore";

function App() {

  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);

  // when the app loads, we need to listen to the database and fetch new todos as they get addded/removed
  useEffect(() => {
    // Create a query that orders todos by the timestamp field in ascending order
    const q = query(collection(db, "todos"), orderBy("timestamp", "desc"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map((doc) => doc.data().todo));
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  const addTodo = async () => {
    if (input.trim() !== '') {
      // Update the local state
      setTodos([...todos, input]);

      // Add todo to Firebase Firestore
      try {
        const docRef = await addDoc(collection(db, 'todos'), {
          todo: input,
          timestamp:serverTimestamp(),
        });

        console.log('Document written with ID: ', docRef.id);

        // Show a success toast message
        toast.success('Todo added successfully!', {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 2000, // Duration in milliseconds
        });
      } catch (error) {
        console.error('Error adding document: ', error);
        // Show an error toast message
        toast.error('An error occurred. Please try again later.', {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 2000,
        });
      }

      setInput('');
    }
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      addTodo();
    }
  };
  
  return (
    <>
     <ToastContainer /> 
    <div className="App">
      <h1 style={{letterSpacing:'2px'}}>TODO APP 🔥</h1>
      <FormControl>
        <InputLabel htmlFor="my-input">✅ Write a Todo</InputLabel>
        <Input value={input} onChange={event => setInput(event.target.value)} onKeyPress={handleInputKeyPress} />
      </FormControl>

      <Button disabled={!input} variant="outlined" onClick={addTodo}>
        Add Todo
      </Button>

      <ul className="listitem">
        {todos.map((todo, index) => (
          <Todo text={todo}/>
        ))}
      </ul>
    </div>
    </>
  );
}

export default App;
