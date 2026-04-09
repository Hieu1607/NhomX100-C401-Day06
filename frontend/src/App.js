import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <div className="container site-header__inner">
            <Link className="brand" to="/">
              <span className="brand__mark">SA</span>
              <span className="brand__text">
                <span className="brand__eyebrow">Frontend prototype</span>
                <span className="brand__name">School Assistant</span>
              </span>
            </Link>

            <nav className="nav" aria-label="Main navigation">
              <a className="nav__link" href="/#journey">
                Journey
              </a>
              <Link className="nav__link" to="/chat">
                Chatbot
              </Link>
              <Link className="button button--primary" to="/chat">
                Try the demo
              </Link>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route element={<LandingPage />} path="/" />
            <Route element={<ChatPage />} path="/chat" />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container footer__inner">
            <span>Prototype UI for hackathon demo flow.</span>
            <span>Landing page + chatbot page, wired to the current backend contract.</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
