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
        type="light"
        theme="light"
        >
        <NavbarBrand href="#">Tablero</NavbarBrand>
        {homePage ?
          <Nav navbar>
            <Button onClick={() => setHomePage(!homePage)} theme="secondary">Get Started</Button>
          </Nav> :
          <></>
        }
      </Navbar>
      {homePage ? <HomePage /> : <Editor />}
    </div>
  );
}

export default App;
