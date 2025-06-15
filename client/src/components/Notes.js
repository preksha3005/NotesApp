import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import particlesOptions from "../particles.json";
import Navbar_login from "./Navbar_login";

const Notes = () => {
  const [title, sett] = React.useState("");
  const [content, setc] = React.useState("");
  const [notes, setn] = React.useState([]);
  const [particlesVisible, setParticlesVisible] = React.useState(false);
  const [editNoteId, setEditNoteId] = React.useState(null); 
  const [editTitle, setEditTitle] = React.useState(""); 
  const [editContent, setEditContent] = React.useState("");
  
  const navigate=useNavigate()
  React.useEffect(() => {
    axios.get("http://localhost:3001/verify").then((result) => {
      if (result.data.status) {
        console.log(result.data.message);
      } else {
        navigate("/");
      }
    });
  }, []);
  React.useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesVisible(true);
    });
  }, []);

  React.useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/get");
      setn(response.data.notes);
    } catch (error) {
      console.error(error);
    }
  };

  const handle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/add", {
        title,
        content,
      });
      sett("");
      setc("");
      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };
  const del = (id) => {
    axios
      .delete("http://localhost:3001/delete/" + id)
       .then((response) => { 
        console.log("Delete response:", response.data);
        fetchNotes();
      })
      .catch((err) => console.log(err));
  };

  const handleEdit=(note)=>{
    setEditNoteId(note._id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }
  
  const handleUpdate=async(e)=>{
    e.preventDefault()
    try{
      const response=await axios.put(`http://localhost:3001/update/${editNoteId}`,{
        title: editTitle,
        content: editContent,
      });
      console.log(response.data.updatedNote)
      const updatedNode=response.data.updatedNote
      setn((prev)=>
        prev.map((note)=>
        note._id==updatedNode._id?updatedNode:note
    ))
      // await fetchNotes()
      setEditNoteId(null)
      setEditTitle("")
      setEditContent("")
    }
    catch(error){
      console.error("Error updating the note ", error)
    }
  }

   const handleCancelEdit = () => {
    setEditNoteId(null);
    setEditTitle("");
    setEditContent("");
  };

  axios.defaults.withCredentials = true;
  console.log(title, content);
  return (
    <div className="archivo-black-regular">
      <Navbar_login />
      <div className="box-add">
        <h2>Add Note</h2>
        <form onSubmit={handle} className="form">
          <input
            type="text"
            placeholder="Title"
            className="title"
            required
            onChange={(e) => sett(e.target.value)}
          />
          <br />
          <br />
          <textarea
            placeholder="Content"
            rows="8"
            cols="50"
            className="content"
            required
            onChange={(e) => setc(e.target.value)}
          />
          <br />
          <br />
          <button type="submit" className="add-btn">
            Add
          </button>
        </form>
      </div>
      <br />
      <br />
      <br />
      <br />
      <div className="notes-sec archivo-black-regular">
        <h2>NOTES</h2>
        <div className="notes-grid">
          {Array.isArray(notes) && notes.length === 0 ? (
            <div>
              <h4>No Notes</h4>
            </div>
          ) : (
            notes.map((note) => {
              return (
                <div key={note._id} className="card"> 
                  {editNoteId === note._id ? ( // If this note is being edited
                    <form onSubmit={handleUpdate} className="edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows="5"
                        required
                      />
                      <button type="submit">Save</button>
                      <button type="button" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    // If this note is NOT being edited, show its content and icons
                    <>
                      <h3 className="title-note">{note.title}</h3>
                      <div className="note-actions">
                        <div className="del" onClick={() => del(note._id)}> {/* Use note._id for delete */}
                          <FaTrashAlt />
                        </div>
                        <div className="edit" onClick={() => handleEdit(note)}> {/* Pass the entire note object */}
                          <FaEdit />
                        </div>
                      </div>
                      <p className="content-note">{note.content}</p>
                    </>
                  )}
                  {/* --- END CONDITIONAL RENDERING --- */}
                </div>
              );
            })
          )}
        </div>
      </div>
      <br />
      <br />
      <div className="bg">
        {particlesVisible && <Particles options={particlesOptions} />}
      </div>
    </div>
  );
};

export default Notes;
