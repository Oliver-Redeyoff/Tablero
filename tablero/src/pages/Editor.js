import {useState} from "react"
import { 
    Container, 
    Row, 
    Col,
    Tabs,
    Tab,
    CardColumns,
    Card,
    Button,
    Form,
} from "react-bootstrap";
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import sushi from "../images/sushi-food.svg"

const type = "Widget"

function Editor() {
    const widgets = [
        {
            "title": "Notes - small",
            "description": "Display a note to yourself",
            "size": [1, 1]
        },
        {
            "title": "Notes - medium",
            "description": "Display a note to yourself",
            "size": [2, 1]
        },
        {
            "title": "Notes - large",
            "description": "Display a note to yourself",
            "size": [3, 1]
        },
        {
            "title": "Weather - small",
            "description": "Show the weather",
            "size": [1, 1]
        },
        {
            "title": "Weather - medium",
            "description": "Show the weather",
            "size": [2, 2]
        },
        {
            "title": "Weather - large",
            "description": "Show the weather",
            "size": [3, 2]
        },
    ]
    return (
        <DndProvider backend={HTML5Backend}>
            <Container style={{paddingTop: "1rem"}}>
                <Row>
                    <Col sm="12" lg="6" >
                        <Viewer />
                    </Col>
                    <Col sm="12" lg="6" >
                        <ControlPanel widgets={widgets}/>
                    </Col>
                </Row>
            </Container>
        </DndProvider>
    )
}

function Viewer() {

    return (
        <h1>Viewer</h1>
    )
}

function ControlPanel({widgets}) {

    return (
        <Tabs style={{maxWidth: "10.84rem"}}>
            <Tab title="Widgets" eventKey="widgets" >
                <Widgets widgets={widgets} />
            </Tab>
            <Tab title="Config" eventKey="config">
                <Config />
            </Tab>
        </Tabs>
    )
}

function Widgets({widgets}) {
    
    return (
        <CardColumns style={{paddingTop: "1rem"}}>
            {widgets.map(e => <Widget widgetInfo={e} />)}
        </CardColumns>
    )
}

function Widget({widgetInfo}) {

    return (
        <Card>
            <Card.Img variant="top" src={sushi} />
            <Card.Body>
                <Card.Title>{widgetInfo?.title}</Card.Title>
                {widgetInfo?.description != null ? <Card.Text>{widgetInfo.description}</Card.Text> : <></>}
            </Card.Body>
        </Card>
    )
}

function Config() {
    const initialRefreshRate = 20
    const [selectedTheme, changeSelectedTheme] = useState("light")
    const [themeChanged, toggleThemeChanged] = useState(false)
    
    const [refreshRate, changeRefreshRate] = useState(initialRefreshRate)

    const changeTheme = (theme) => {
        changeSelectedTheme(theme)
        toggleThemeChanged(!themeChanged)
    }

    return (
        <Form className="mb-3" style={{paddingTop: "1rem"}} onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group>
                <Form.Label>Device theme:</Form.Label>
                <Button 
                    variant={selectedTheme == "light" ? "secondary" : "outline-secondary"} 
                    style={{margin: "0.5rem"}}
                    onClick={() => changeTheme("light")}
                >
                    Light
                </Button>
                <Button 
                    variant={selectedTheme == "dark" ? "secondary" : "outline-secondary"} 
                    style={{margin: "0.5rem"}}
                    onClick={() => changeTheme("dark")}
                >
                    Dark
                </Button>
            </Form.Group>
            <Form.Group>
                <Form.Label>Screen refresh rate (seconds):</Form.Label>
                <Form.Control 
                    type="number" 
                    placeholder={initialRefreshRate} 
                    value={refreshRate}
                    onChange={(event) => changeRefreshRate(event.target.value)}
                />
            </Form.Group>
            {themeChanged || refreshRate != initialRefreshRate ? 
                <Button variant="secondary" type="submit">Save changes</Button> : 
            <></>}
        </Form>
    )
}

export default Editor