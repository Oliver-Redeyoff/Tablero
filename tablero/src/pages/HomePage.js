import { 
    Container, 
    Row, 
    Col, 
    ListGroup, 
} from "react-bootstrap";
import {Player, BigPlayButton, ControlBar} from 'video-react'
import promoVideo from "../images/Tablero.mp4"
import bg from "../images/front-page-bg-2.jpg"
import img from "../images/front-page-img-1.jpeg"
import "../style.css"
import "../reactVideo.css"

function HomePage() {
    return (
        <Container fluid>
            <div className="frontPage" style={{ backgroundImage: `url(${bg})` }}>
                <div className="frontPageBgDarken"></div>
                <h1 className="buzzwords">
                    <h1 style={{borderRight: "10px solid rgb(255, 66, 49)"}}>Modern</h1>
                    <h1 style={{borderRight: "10px solid rgb(244, 196, 95)"}}>Simple</h1>
                    <h1 style={{borderRight: "10px solid rgb(99, 202, 183)"}}>Smart</h1>
                </h1>
            </div>

            <div className="description">
                <h1 style={{marginBottom: "20px"}}>What is Tablero?</h1>
                <p>Tablero is a dashboard that compiles the information that is most important to you on a eink display. 
                This display is high resolution and paper like, allowing it to integrate seemlessly into it's environment and be as undistracting as possible.</p>
            </div>
            
            <Row style={{backgroundColor: "rgba(70, 70, 70, 0.1)"}}>
                <Col sm="12" lg="6" style={{padding: "50px"}}>
                    <img src={img} style={{height: "400px", display: "block", margin: "0px auto"}} alt=""/>
                </Col>
                <Col sm="12" lg="6" style={{marginTop: "75px"}}>
                    <ListGroup style={{width: "400px"}}>
                        <ListGroup.Item>
                            <ListGroup variant="flush">
                                <ListGroup.Item><b>Displays</b></ListGroup.Item>
                                <ListGroup.Item>Notes</ListGroup.Item>
                                <ListGroup.Item>Todo lists</ListGroup.Item>
                                <ListGroup.Item>Weahter</ListGroup.Item>
                                <ListGroup.Item>Calendar</ListGroup.Item>
                                <ListGroup.Item>Pictures</ListGroup.Item>
                            </ListGroup>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>

            <Row style={{padding: "50px 80px", marginTop: "40px"}}>
                <Col>
                    <Player src={promoVideo} preload="auto">
                        <BigPlayButton position="center" />
                        <ControlBar autoHide={true} autoHideTime={500}/>
                    </Player>
                </Col>
            </Row>
            
        </Container>
    )
}

export default HomePage