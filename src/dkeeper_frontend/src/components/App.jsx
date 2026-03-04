import React, { useState,useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { dkeeper_backend } from "../declarations/dkeeper_backend/index";

function App() {
  const [notes, setNotes] = useState([]);


  function addNote(newNote) {
    setNotes(prevNotes => {
      dkeeper_backend.createNote(newNote.title, newNote.content)
      return [newNote,...prevNotes];
    });
  }

  useEffect(()=>{
    console.log(",,,hhh");
    fetchNotes();
  },[])

  async function fetchNotes(){
    const notePad= await dkeeper_backend.readNotes();
    console.log(notePad);
    setNotes(notePad);
  }

  function deleteNote(id) {
    dkeeper_backend.removeNotes(id);
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
