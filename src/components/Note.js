import { Link, withRouter } from "react-router-dom";
import React from "react";
import ReactQuill from "react-quill";
import debounce from "../helpers";
import "./Dashboard.scss";
const firebase = require("firebase");

class Note extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "",
      text: "",
      timestamp: null,
      email: null,
      showSaveNotification: false,
    };
  }

  render() {
    // console.log(this.props);
    return (
      <div className="notes-screen">
        {this.state.showSaveNotification && <h5 className="save">Saving...</h5>}
        <Link to="/dashboard">
          <svg
            className="app-btn app-btn--back"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18" cy="18" r="17.5" />
            <path d="M16.2635 23.7318C16.6153 24.0894 17.1857 24.0893 17.5374 23.7318C17.8893 23.374 17.8893 22.7941 17.5372 22.4362L14.0759 18.9164L24.0993 18.9154C24.5968 18.9153 25 18.5053 25 17.9992C24.9999 17.4933 24.5967 17.0834 24.0992 17.0834L14.0754 17.0844L17.5376 13.5638C17.8894 13.2061 17.8894 12.6259 17.5376 12.2683C17.3616 12.0895 17.1312 12 16.9006 12C16.6701 12 16.4396 12.0895 16.2637 12.2682L11.2639 17.3525C11.0949 17.5242 11 17.7571 11 18.0001C11.0001 18.2432 11.095 18.476 11.264 18.6481L16.2635 23.7318Z" />
          </svg>
        </Link>
        <input
          placeholder="Give your note a title"
          className="app-input app-input__title"
          value={this.state.title ? this.state.title : ""}
          onChange={(e) => this.updateTitle(e.target.value)}
        ></input>
        <h4 className="modified">
          Last modified: {this.convertTimestampToDate(this.state.timestamp)}
        </h4>
        <ReactQuill
          placeholder="Got an idea? Write about it!"
          theme="snow"
          value={this.state.text}
          onChange={this.updateBody}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "code-block",
          ]}
          // modules={{
          //   toolbar: [
          //     { header: [1, 2, false] },
          //     "bold",
          //     "italic",
          //     "underline",
          //     "link",
          //     "code-block",
          //     { list: "ordered" },
          //     { list: "bullet" },
          //   ],
          // }}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              ["link", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["color", "image"],
            ],
          }}
        ></ReactQuill>
        <button class="delete" onClick={this.deleteNote}>
          Delete note
        </button>
      </div>
    );
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.setState(
        {
          title: this.props.location.state.title,
          text: this.props.location.state.text,
          timestamp: this.props.location.state.timestamp,
          email: this.props.location.state.email,
          index: this.props.location.state.index,
          backgroundColor: this.props.location.state.backgroundColor,
        }
        // },
        // () => console.log("Note state ", this.state)
      );
    }, 100);
  };

  componentDidUpdate = () => {
    // console.log(this.state);
  };

  deleteNote = async () => {
    if (
      window.confirm(`Are you sure you want to delete ${this.state.title}?`)
    ) {
      if (this.state.email) {
        let notesAfterDeletion;
        await firebase
          .firestore()
          .collection("notes")
          .doc(this.state.email)
          .get()
          .then(async (res) => {
            const data = res.data();
            const notes = data.savedNotes;
            notesAfterDeletion = [...notes];
            notesAfterDeletion.splice(this.state.index, 1);
          });

        // console.log("notesAfterDeletion =", notesAfterDeletion);

        await firebase
          .firestore()
          .collection("notes")
          .doc(this.state.email)
          .set({
            savedNotes: [...notesAfterDeletion],
          });
        this.props.history.push({
          pathname: `/dashboard`,
        });
      }
    }
  };

  updateBody = async (val) => {
    await this.setState({ text: val });
    // console.log("body", this.state.text);
    this.updateNote();
  };
  updateTitle = async (txt) => {
    await this.setState({ title: txt });
    // console.log("title", this.state.title);
    this.updateNote();
  };
  // make this a helper function and import it for Note and Overview
  convertTimestampToDate = (timestamp) => {
    const date = Date(timestamp);
    // return date;
    const dateArray = date.split(" ");
    const dateFormatted = [dateArray[1], dateArray[2], dateArray[3]].join(" ");
    return dateFormatted;
  };

  updateNote = debounce(async () => {
    console.log("updating note on database");
    if (this.state.email) {
      this.setState({ showSaveNotification: true });
      setTimeout(() => this.setState({ showSaveNotification: false }), 1000);
      console.log("updating note from email", this.state.email);
      let editedNotes;
      await firebase
        .firestore()
        .collection("notes")
        .doc(this.state.email)
        .get()
        .then(async (res) => {
          const data = res.data();
          const notes = data.savedNotes;
          editedNotes = [...notes];
          editedNotes[this.state.index].title = this.state.title;
          editedNotes[this.state.index].body = this.state.text;
          editedNotes[this.state.index].timestamp = Date.now();
          editedNotes[
            this.state.index
          ].backgroundColor = this.state.backgroundColor;
        });

      console.log("editedNotes =", editedNotes);

      firebase
        .firestore()
        .collection("notes")
        .doc(this.state.email)
        .set({
          savedNotes: [...editedNotes],
        });
    }
  }, 1000);
  //   update = debounce(() => {
  //     this.props.noteUpdate(this.state.id, {
  //       title: this.state.title,
  //       body: this.state.text,
  //     });
  //   }, 1500);
}

export default withRouter(Note);
