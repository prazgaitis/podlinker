import React from "react";
import LinkForm from "./LinkForm";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1 className="title">Paste a podcast URL</h1>
      <h2 className="subtitle">I'll give ya the links</h2>
      <LinkForm />
    </div>
  );
}
