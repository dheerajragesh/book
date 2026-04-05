import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Components/Header";
import Main from "./Components/Main";
import Footer from "./Components/Footer";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

function App() {
  return (
    <Router>
      {/* d-flex flex-column: Stacks items vertically
        min-vh-100: Makes the app take the full height of the screen
      */}
      <div className="app-container d-flex flex-column min-vh-100">
        <Header />
        
        {/* We wrap Main or add a class to it to control the background */}
        <div className="flex-grow-1 main-content">
          <Main />
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;