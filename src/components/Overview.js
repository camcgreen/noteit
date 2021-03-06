import { Link, withRouter } from "react-router-dom";
import React from "react";
import "./Dashboard.scss";
const firebase = require("firebase");

class Overview extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: "",
      notesClass: "notes__note",
      notes: null,
      email: null,
      colours: [
        {
          orange: "#ffdbcd",
        },
        {
          beige: "#fff5e8",
        },
        {
          pink: "#ffe4ed",
        },
        {
          purple: "#f4e4fa",
        },
        {
          blue: "#ccf4f5",
        },
        {
          green: "#e5f9ea",
        },
        {
          yellow: "#fffdc8",
        },
      ],
    };
  }

  render() {
    const colourItems = this.state.colours.map((colour, i) => {
      return (
        <li
          className={`new-note__colours__circle new-note__colours__circle--${
            Object.keys(colour)[0]
          } ${this.state.visible}`}
          style={
            this.state.visible === "visible"
              ? {
                  backgroundColor: colour[Object.keys(colour)[i]],
                  transition: `opacity ${(i + 1) / 12}s ease-in-out`,
                  cursor: "pointer",
                }
              : {
                  backgroundColor: colour[Object.keys(colour)[i]],
                  transition: `opacity ${(i + 1) / 12}s ease-in-out`,
                }
          }
          key={i}
          onClick={this.addNote.bind(this, colour[Object.keys(colour)[0]])}
        ></li>
      );
    });
    return (
      <div className="overview-screen">
        <div className="new-note">
          <h1 className="new-note__h1">Notes</h1>
          <svg
            // className="new-note__btn-add"
            className="app-btn app-btn--add"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={this.toggleColoursVisibility}
          >
            <circle cx="18" cy="18" r="17.5" fill="white" stroke="#2E2E2E" />
            <line
              x1="18"
              y1="12"
              x2="18"
              y2="24"
              stroke="#2E2E2E"
              stroke-width={this.state.visible ? 0 : 2}
              style={{ transition: "stroke-width 0.1s ease-in-out" }}
            />
            <line
              x1="24"
              y1="18"
              x2="12"
              y2="18"
              stroke="#2E2E2E"
              stroke-width="2"
            />
          </svg>
        </div>
        <ul className="new-note__colours">{colourItems}</ul>
        {this.state.notes !== null && this.state.notes.length === 0 && (
          <h1 className="no-notes">You have no notes to display</h1>
        )}
        {this.state.notes !== null ? (
          <ul className="notes">
            {this.state.notes.map((note, i) => {
              return (
                <Link
                  to={{
                    pathname: `/note/${note.id}`,
                    state: {
                      title: note.title,
                      text: note.body,
                      timestamp: note.timestamp,
                      email: this.props.email,
                      index: i,
                      backgroundColor: note.backgroundColor,
                    },
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <li
                    className={this.state.notesClass}
                    key={i}
                    style={{
                      backgroundColor: note.backgroundColor,
                      transition: `opacity ${(i + 1) / 6}s ease-in-out`,
                    }}
                  >
                    <div className="notes__note__container">
                      <p className="notes__note__container__title">
                        {note.title}
                      </p>
                      <p className="notes__note__container__date">
                        {this.convertTimestampToDate(note.timestamp)}
                        {/* {note.timestamp} */}
                      </p>
                    </div>
                  </li>
                </Link>
              );
            })}
          </ul>
        ) : (
          <div class="lds-ripple">
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    );
  }

  componentDidUpdate = async (newProps) => {
    const oldProps = this.props;
    if (oldProps.email !== newProps.email) {
      if (this.props.email) {
        await firebase
          .firestore()
          .collection("notes")
          .doc(this.props.email)
          .onSnapshot(async (res) => {
            const data = res.data();
            if (data) {
              const notes = data.savedNotes;
              await this.setState(() => ({
                notes,
              }));
            }
          });
        setTimeout(
          () => this.setState({ notesClass: "notes__note visible" }),
          500
        );
      }
    }
  };
  toggleColoursVisibility = () => {
    if (this.state.visible === "") {
      this.setState({ visible: "visible" });
    } else {
      this.setState({ visible: "" });
    }
  };
  addNote = (colour) => {
    if (this.state.visible === "visible") {
      const newNote = {
        title: "",
        body: "",
        timestamp: Date.now(),
        backgroundColor: colour,
        id: this.generateRandomString(10),
      };
      this.setState(
        (prevState) => ({
          notes: [...prevState.notes, newNote],
          visible: false,
        }),
        async () => {
          if (this.props.email) {
            await firebase
              .firestore()
              .collection("notes")
              .doc(this.props.email)
              .set({
                savedNotes: [...this.state.notes],
              });

            this.props.history.push({
              pathname: `/note/${newNote.id}`,
              state: {
                title: newNote.title,
                text: newNote.body,
                timestamp: newNote.timestamp,
                email: this.props.email,
                index: this.state.notes.length - 1,
                backgroundColor: colour,
              },
            });
          }
        }
      );
    }
  };
  convertTimestampToDate = (timestamp) => {
    const myDate = new Date(timestamp);
    const dateString = myDate.toGMTString();
    const dateArray = dateString.split(" ");
    const dateFormatted = [dateArray[1], dateArray[2], dateArray[3]].join(" ");
    return dateFormatted;
  };

  generateRandomString = (length) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = length; i > 0; --i)
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  };
}

export default withRouter(Overview);
