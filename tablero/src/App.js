import {useState} from "react"
import {
  Button,
  Navbar, 
} from "react-bootstrap"
import HomePage from './pages/HomePage.js'
import Editor from './pages/Editor.js'
import logo from "./images/logo.svg"

function App() {
  const [homePage, setHomePage] = useState(true)

  return (
    <div>
      <Navbar className="fadeIn"
        variant="light"
        style = {{
          position: "relative", 
          backgroundColor: homePage ? "transparent" : "rgba(0, 0, 0, 0.1)", 
          zIndex: 2, 
          padding: "30px", 
          height: homePage ? "140px" : "80px",
          transition: "all 0.2s"
        }}
      >
        <Navbar.Brand href="#"><img src={logo} style={{
          height: homePage ? "100px" : "60px",
          transition: "all 0.2s"
        }}></img></Navbar.Brand>
        {homePage ?
          <Navbar.Collapse className="justify-content-end">
            <Button 
              style={{backgroundColor: 'rgb(255, 66, 49)', border: "none"}}
              className="justify-content-end" 
              onClick={() => setHomePage(!homePage)} 
              variant="secondary"
            >
              Go to dashboard
            </Button></Navbar.Collapse>:
          <h1 class="fadeIn" style={{
            position: "absolute", 
            left: "50%", 
            transform: "translateX(-50%)",
            fontWeight: "600",
            color: "rgb(20, 20, 20)"
          }}>Dashboard</h1>
        }
      </Navbar>
      {homePage ? <HomePage /> : <Editor />}
    </div>
  );
}

export default App;
