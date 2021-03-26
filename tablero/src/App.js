import {useState} from "react"
import {
  Button,
  Navbar, 
  NavbarBrand,
  Nav,
} from "shards-react"
import HomePage from './pages/HomePage.js'
import Editor from './pages/Editor.js'

function App() {
  const [homePage, setHomePage] = useState(true)

  return (
    <div>
      <Navbar
        type="dark"
        theme="primary"
        >
        <NavbarBrand href="#">Tablero</NavbarBrand>
        {homePage ?
          <Nav navbar>
            <Button onClick={() => setHomePage(!homePage)}>Get Started</Button>
          </Nav> :
          <></>
        }
      </Navbar>
      {homePage ? <HomePage /> : <Editor />}
    </div>
  );
}

export default App;
