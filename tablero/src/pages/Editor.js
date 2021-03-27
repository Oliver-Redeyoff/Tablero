import {useState, useEffect} from "react"
import { 
    Container, 
    Row, 
    Col,
    Tabs,
    Tab,
    CardColumns,
    CardDeck,
    Card,
    Button,
    Form,
    Modal,
} from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {cloneDeep} from "lodash";
import sushi from "../images/sushi-food.svg"
import calendar from "../images/calendarIcon.png"

const WidgetDragTypes = {
    WIDGET: 'widget'
}

const API_URL = 'https://europe-west2-la-hacks-308508.cloudfunctions.net' 

function createGridWidgetFromWidget(widget, location) {
    const copiedWidget = cloneDeep(widget);
    copiedWidget['x'] = location[0]
    copiedWidget['y'] = location[1]
    return copiedWidget
}

function Editor() {

    const [gridWidgets, changeGridWidgets] = useState([])
    const [widgets, updateWidgets] = useState([])
    const [config, setConfig] = useState({})
    const [getConfigTrigger, triggerGetConfig] = useState(false)


    const [userLoggedIn, changeUserLoggedIn] = useState(false)
    const [deviceName, updateDeviceName] = useState("")
    const [secret, updateSecret] = useState("")
    
    // Calls get-config endpoint
    useEffect(() => {
        if (!userLoggedIn) {
            return
        }
        fetch(API_URL + '/get-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user_id': deviceName,
                'secret': secret
            })
        }).then((response) => 
            response.json()
        ).then((json) => {
            if (json.config != null) {
                setConfig(json.config)
            }
            if (json.grid != null) {
                changeGridWidgets(json.grid.map((item) => {
                    const parents = widgets.filter(ele => ele.id == item.id)
                    if (parents.length > 0) {
                        const fullWidget = {...item, ...cloneDeep(parents[0])}
                        return fullWidget
                    }
                    return null
                    
                }).filter(ele => ele != null))
            }
        }).catch(e => {console.warn(e)})
    }, [widgets, getConfigTrigger, userLoggedIn])

    // Calls get-widgets endpoint
    useEffect(() => {
        fetch(API_URL + '/get-widgets').then((response) => 
                response.json()
            ).then((json) => {

                if (json.widgets != null) {
                    const widgetConfigs = []

                    for (const widgetConfig of json.widgets) {

                        Object.keys(widgetConfig).forEach((key) => {
                            const widgetSizes = [];
                            const baseObject = cloneDeep(widgetConfig[key])
                            baseObject.id = key;

                            for (let widgetSize of ['sm', 'md', 'lg']) {
                                if (baseObject[widgetSize] != null) {
                                    const sizedObject = cloneDeep(baseObject)
                                    sizedObject.size = baseObject[widgetSize]
                                    sizedObject.title = baseObject.title + " - " + widgetSize
                                    sizedObject.id = key + "-" + widgetSize
                                    widgetSizes.push(sizedObject)
                                }
                            }

                            if (widgetSizes.length > 0) {
                                widgetConfigs.push(...widgetSizes)
                            } else {
                                widgetConfigs.push(baseObject)
                            }

                        })
 
                    }
                    updateWidgets(widgetConfigs)
                }
            }).catch(err => console.warn(err))
    }, [])


    const handleLogin = () => {
        fetch(API_URL+'/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user_id': deviceName,
                'secret': secret
            })}).then((resp) => resp.json()).then((json) => {
                if (json.success === true) {
                    changeUserLoggedIn(true);

                }
            })
        }
    
    
    const saveGrid = () => {
        const to_send = {
            'user_id': deviceName,
            'secret': secret,
            'grid': gridWidgets
        }
        fetch(API_URL+'/set-grid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        }).then((resp) => resp.json()).then((json) => {
            if (json.success === true) {
                triggerGetConfig((current) => !current)
            } else {
                console.warn('Couldn\'t save config')
            }
        }).catch((err) => {console.warn(err)})
    }
    return (
        <>
            <Modal
                show={!userLoggedIn}
                backdrop="static"
                centered
                keyboard={false}>

                <Modal.Header>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => {e.preventDefault()}}>
                        <Form.Group>
                            <Form.Label>Device name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={deviceName}
                                onChange={(event) => updateDeviceName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Secret</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={secret}
                                onChange={(event) => updateSecret(event.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleLogin}>Sign in</Button>
                </Modal.Footer>
            </Modal>

            <DndProvider backend={HTML5Backend}>
                <Container style={{paddingTop: "1rem"}}>
                    <Row style={{paddingBottom: "1rem"}}><Button onClick={saveGrid} variant="secondary">Save Grid</Button></Row>
                    <Row>
                        <Col sm="12" lg="6" >
                            <Grid 
                                gridWidgets={gridWidgets} 
                                changeGridWidgets={changeGridWidgets}
                            />
                        </Col>
                        <Col sm="12" lg="6" >
                            <ControlPanel widgets={widgets} config={config} triggerGetConfig={triggerGetConfig}/>
                        </Col>
                    </Row>
                </Container>
            </DndProvider>
        </>
    )
}


function Grid({gridWidgets, changeGridWidgets}) {

    const width = 3
    const height = 5

    const gridTiles = [];
    for(let i=0 ; i<width*height ; i++) {
        const position = [i%width, Math.floor(i/width)]
        gridTiles.push(<GridTile key={i} position={position} changeGridWidgets={changeGridWidgets}/>)
    }
    
    return (
        <div style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%"
        }}>
            {gridTiles.map((gridTile) => gridTile)}
            {gridWidgets.map((gridWidget, index) => <GridWidget key={index} widget={gridWidget} />)}
        </div>
    )
}

function GridTile({position, changeGridWidgets}) {
    // Droppable target in the Grid
    const onDrop = (item) => {
        changeGridWidgets((current) => [...current, createGridWidgetFromWidget(item, position)])
    }

    const [{}, drop] = useDrop(() => ({
        accept: WidgetDragTypes.WIDGET,
        drop: (item) => {onDrop(item)},
    }))
    
    return (
        <div style={{
            position: "absolute",
            top: position[1] * 100/5 + "%",
            left: position[0] * 100/3 + "%",
            height: 100/5 + "%",
            width: 100/3 + "%",
            padding: "10px"
        }}
        ref={drop}>
        <div style={{backgroundColor: "rgba(0, 0, 0, 0.2)", height: "100%", width: "100%"}}></div></div>
    )
}

function GridWidget({widget}) {
    // Widget overlayed on top of GridTile
    const size = widget.size
    
    return (
        <div style={{
            position: "absolute",
            width: size.width*100/3 + "%",
            height: size.height*100/5 + "%",
            left: widget.x*100/3 + "%",
            top: widget.y*100/5 + "%",
            padding: "10px"
        }}>
            <div style={{backgroundColor: "rgba(0, 0, 0)", height: "100%", width: "100%"}}>
                <p style={{color: "white"}}>{widget.title}</p>
            </div>
        </div>
    )
}

function ControlPanel({widgets, config, triggerGetConfig}) {

    return (
        <Tabs>
            <Tab title="Widgets" eventKey="widgets" >
                <Widgets widgets={widgets} />
            </Tab>
            <Tab title="Config" eventKey="config">
                <Config config={config} triggerGetConfig={triggerGetConfig}/>
            </Tab>
        </Tabs>
    )
}

function Widgets({widgets}) {
    
    return (
        <CardColumns style={{paddingTop: "1rem"}}>
            {Object.values(widgets).map((ele, index) => <Widget key={index} widgetInfo={ele} />)}
        </CardColumns>
    )
}

function Widget({widgetInfo}) {

    console.log(widgetInfo)

    const [_, drag] = useDrag(() => ({
        type: WidgetDragTypes.WIDGET,
        item: widgetInfo,
      }))
    
    return (
        <Card ref={drag}>
            <Card.Img variant="top" src={widgetInfo.iconURL} style={{pointerEvents: "none"}} />
            <Card.Body>
                <Card.Title>{widgetInfo?.title}</Card.Title>
                {widgetInfo?.description != null ? <Card.Text>{widgetInfo.description}</Card.Text> : <></>}
            </Card.Body>
        </Card>
    )
}

function Config({config, triggerGetConfig}) {
    const initialTheme = config.bgColor != null ? config.bgColor : "light"
    const initialRefreshRate = config.refreshFrequency != null ? config.refreshFrequency : 20

    const [selectedTheme, changeSelectedTheme] = useState(initialTheme)
    const [refreshRate, changeRefreshRate] = useState(initialRefreshRate)

    const handleSaveChanges = (event) => {
        event.preventDefault()
        fetch(API_URL+'/set-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user_id': 'test-new-data',
                'secret': 'password',
                'config': {
                    'refreshFrequency': refreshRate,
                    'bgColor': selectedTheme
                }
            })
        }).then(resp => resp.json()).then((json) => {
            if (json.success !== true) {
                console.warn('Save did not succeed')
            } else {
                triggerGetConfig((current) => !current)
            }
        }).catch((err) => {console.warn(err)})
    };

    return (
        <Form className="mb-3" style={{paddingTop: "1rem"}} onSubmit={(e) => {e.preventDefault()}}>
            <Form.Group>
                <Form.Label>Device theme:</Form.Label>
                <Button 
                    variant={selectedTheme == "light" ? "secondary" : "outline-secondary"} 
                    style={{margin: "0.5rem"}}
                    onClick={() => changeSelectedTheme("light")}
                >
                    Light
                </Button>
                <Button 
                    variant={selectedTheme == "dark" ? "secondary" : "outline-secondary"} 
                    style={{margin: "0.5rem"}}
                    onClick={() => changeSelectedTheme("dark")}
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
            {initialTheme != selectedTheme || refreshRate != initialRefreshRate ? 
                <Button variant="secondary" type="submit" onClick={handleSaveChanges}>Save changes</Button> : 
            <></>}
        </Form>
    )
}

export default Editor