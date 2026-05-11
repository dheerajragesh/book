import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Components/Header";
import Main from "./Components/Main";
import Footer from "./Components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container d-flex flex-column min-vh-100">
          <Header />

          <div className="flex-grow-1 main-content">
            <Main />
          </div>

          <Footer />
        </div>
      </Router>
    </ThemeProvider>

  );
}

export default App;