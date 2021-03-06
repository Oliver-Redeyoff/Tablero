import React, {useState, useEffect, useReducer} from "react"
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
    Alert,
} from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {cloneDeep} from "lodash";

const WidgetDragTypes = {
    WIDGET: 'widget'
}

const API_URL = 'https://europe-west2-la-hacks-308508.cloudfunctions.net'
console.log("has loaded the api url")

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

    const [saving, changeSaving] = useState(false)
    const [userLoggedIn, changeUserLoggedIn] = useState(false)
    const [failedLogin, setFailedLogin] = useState(false)
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
                        const fullWidget = {...cloneDeep(parents[0]), ...item}
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
                } else {
                    setFailedLogin(true)
                    updateDeviceName("")
                    updateSecret("")
                }
            }).catch((err) => {
                setFailedLogin(true)
                console.warn(err)
            })
        }
    
    
    const saveGrid = () => {
        changeSaving(true)
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
            changeSaving(false)
            if (json.success === true) {
                triggerGetConfig((current) => !current)
            } else {
                console.warn('Couldn\'t save config')
            }
        }).catch((err) => {console.warn(err)})
    }
    return (
        <>
            { saving ? <div className="savingScreen">
                <div className="loadingBox"></div>
            </div> : <></> }
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
                    {failedLogin ? <Alert variant="danger">Login failed</Alert> : <></>}
                    <Button variant="primary" size="lg" onClick={handleLogin}>Sign in</Button>
                </Modal.Footer>
            </Modal>

            <DndProvider backend={HTML5Backend}>
                <Container style={{marginTop: "60px", maxWidth: "1250px"}}>
                    <Row style={{backgroundColor: "rgba(100, 100, 100, 0.1)", padding: "40px 0px", marginBottom: "50px"}}>
                        <Col sm="12" lg="5" style={{
                            height: "1000px", 
                            backgroundColor: "rgba(212, 204, 188)", 
                            marginLeft: 100/24 + "%",
                            marginRight: 100/12 + "%"
                        }}>
                            <div style={{
                                position: "absolute",
                                top: "15px",
                                left: "15px",
                                width: "calc(100% - 30px)",
                                height: "calc(100% - 30px"
                            }}>
                                <Grid 
                                    gridWidgets={gridWidgets} 
                                    changeGridWidgets={changeGridWidgets}
                                />
                            </div>
                        </Col>
                        <Col sm="12" lg="5">
                            <ControlPanel widgets={widgets} config={config} triggerGetConfig={triggerGetConfig}/>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: "100px"}}>
                        <Button onClick={saveGrid} variant="primary" style={{display: "block", margin: "0px auto", width: "250px"}}>Save Grid</Button>
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

    const removeCallback = (index) => {
        const copyWidgets = gridWidgets.filter((ele, eleIndex) => eleIndex != index)
        changeGridWidgets(copyWidgets)
    }

    const editCallback = (index, newConfig) => {
        const newWidget = cloneDeep(gridWidgets[index])
        newWidget.config = newConfig
        const copyWidgets = cloneDeep(gridWidgets)
        copyWidgets[index] = newWidget
        changeGridWidgets(copyWidgets)
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
            {gridWidgets.map((gridWidget, index) => <GridWidget 
                                                        key={index} 
                                                        index={index} 
                                                        widget={gridWidget} 
                                                        removeCallback={removeCallback} 
                                                        editCallback={editCallback} 
                                                    />)}
        </div>
    )
}

function GridTile({position, changeGridWidgets}) {
    
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


function GridWidget({widget, index, removeCallback, editCallback}) {

    // Widget overlayed on top of GridTile
    const size = widget.size
    const [modalOpen, setModalOpen] = useState(false)
    const [configValue, updateConfigValue] = useState(cloneDeep(widget.config))

    const removeWrapper = () => {
        removeCallback(index)
    }

    const saveChanges = () => {
        editCallback(index, configValue)
        setModalOpen(false)
    }

    const updateConfigValueWrapper = (configKey, value) => {
        updateConfigValue((current) => {
            const old = cloneDeep(current)
            old[configKey] = value
            return old
        })
    }

    return (
        <div style={{
            position: "absolute",
            width: size.width*100/3 + "%",
            height: size.height*100/5 + "%",
            left: widget.x*100/3 + "%",
            top: widget.y*100/5 + "%",
            padding: "10px"
        }}>
            {widget.config != null ?
            <Modal
                show={modalOpen}
            >
                <Modal.Header>{widget.title}</Modal.Header>
                <Modal.Body>
                    <Form>
                        {Object.entries(configValue).map(([key, val]) => <GridWidgetFormItem key={key} configKey={key} configValue={val} updateConfigValueCallback={updateConfigValueWrapper}/>)}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={saveChanges}>Confirm</Button>
                    <Button onClick={() => {setModalOpen(false)}}>Cancel</Button>
                </Modal.Footer>
            </Modal> :
            <></> }
            <div style={{
                backgroundColor: "rgba(30, 18, 26)", 
                width: "100%", 
                height: "100%",
                padding: "10px"}}>
                <p style={{color: "white", fontSize: "12px"}}>{widget.title}</p>
                <a size="sm" style={{
                    position: "absolute",
                    right: "20px",
                    top: "20px",
                    height: "25px",
                    width: "25px",
                    borderRadius: "5px",
                    color: "white",
                    border: "1px solid white",
                    paddingTop: "0px",
                    textAlign: "center",
                    cursor: "pointer"
                }} variant="outline-light" onClick={removeWrapper}>X</a>

                {widget.config != null ? 
                <div style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    padding: "5px 10px",
                    borderTop: "2px solid white",
                    borderLeft: "2px solid white",
                    borderTopLeftRadius: "5px",
                    backgroundColor: "white",
                    color: "black",
                    zIndex: "10",
                    fontWeight: "600",
                    cursor: "pointer"
                }} onClick={() => setModalOpen(true)}>Edit</div> 
                : <></>}
                
                <img src={widget.iconURL} style={{
                    position: "absolute",
                    maxWidth: "50%",
                    maxHeight: "50%",
                    left: "50%",
                    top: "50%",
                    transform: "translateX(-50%) translateY(-50%)",
                    filter: "brightness(0) invert(1)"
                }}/>

            </div>
        </div>
    )
}

function GridWidgetFormItem({configKey, configValue, updateConfigValueCallback}) {

    const [formValue, updateFormValue] = useState(cloneDeep(configValue)) // Deep copy?
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const updateFormValueWrapper = (key, value) => {
        updateFormValue(value)
        updateConfigValueCallback(key, value)
        forceUpdate()
    }

    const listUpdate = (index, value) => {
        const newArray = cloneDeep(formValue)
        if (index >= formValue.length) {
            newArray.push("")
        } else {
            newArray[index] = value
        }
        updateFormValueWrapper(configKey, newArray)
    }

    const listRemove = (index) => {
        const newArray = cloneDeep(formValue).filter((ele, ind) => ind != index)
        updateFormValueWrapper(configKey, newArray)
        
    }
    if (Array.isArray(formValue)) {
        return (
            <Form.Group>
                <Form.Label>{configKey}</Form.Label>
                <Container style={{margin: "0.5rem"}}>
                    {formValue.map((val, ind) => {
                        return (
                            <Row>
                                <Col>
                                    <Row><GridWidgetFormItem 
                                        key={val} 
                                        configValue={val} 
                                        configKey={ind} 
                                        updateConfigValueCallback={listUpdate}
                                    /></Row>
                                    <Row><Button onClick={() => {listRemove(ind)}}>Remove</Button></Row>
                                </Col>
                            </Row>
                        )
                    })}
                </Container>
                <Button style={{marginLeft: "8px", marginTop: "30px"}} onClick={() => {listUpdate(formValue.length, "")}}>Add item</Button>
            </Form.Group>
        )
    }

    return (
        <Form.Group>
            <Form.Label>{configKey}</Form.Label>
                <Form.Control 
                    type="text" 
                    value={formValue}
                    onChange={(event) => updateFormValueWrapper(configKey, event.target.value)}
                />
        </Form.Group>
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
                console.warn('Save did not succeed, there must be a problem somewhere')
                console.log('you should look into this')
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
                <Form.Label>Screen refresh rate (in seconds):</Form.Label>
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