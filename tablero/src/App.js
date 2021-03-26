import {useState} from "react"
import {
  Button,
  Navbar, 
} from "react-bootstrap"
import HomePage from './pages/HomePage.js'
import Editor from './pages/Editor.js'

function App() {
  const [homePage, setHomePage] = useState(true)

  return (
    <div>
      <Navbar
        variant="light"
        bg="light"
      >
        <Navbar.Brand href="#">Tablero</Navbar.Brand>
        {homePage ?
          <Navbar.Collapse className="justify-content-end">
            <Button 
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
