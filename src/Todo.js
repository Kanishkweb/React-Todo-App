import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import './Todo.css'
import React from 'react'
function Todo(props) {
  return (
    <List className='list'>
        <ListItem>
            <ListItemText primary={props.text} secondary="Dummy Deadline ⏰"/>
        </ListItem>
    </List>
  )
}

export default Todo
