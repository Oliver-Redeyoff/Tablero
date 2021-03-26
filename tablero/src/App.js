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
      <Navbar
        variant="light"
        style = {{backgroundColor: "transparent", zIndex: 2, padding: "30px", height: "140px"}}
      >
        <Navbar.Brand href="#"><img src={logo} width="70px"></img></Navbar.Brand>
        {homePage ?
          <Navbar.Collapse className="justify-content-end">
            <Button 
              style={{backgroundColor: 'rgb(255, 66, 49)', border: "none"}}
              className="justify-content-end" 
              onClick={() => setHomePage(!homePage)} 
              variant="secondary"
            >
              Get Started
            </Button></Navbar.Collapse>:
          <></>
        }
      </Navbar>
      {homePage ? <HomePage /> : <Editor />}
    </div>
  );
}

export default App;
