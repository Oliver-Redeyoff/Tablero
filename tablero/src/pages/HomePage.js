import { 
    Container, 
    Row, 
    Col, 
    ListGroup, 
} from "react-bootstrap";
import {Player, BigPlayButton, ControlBar} from 'video-react'
import sushi from "../images/sushi-food.svg"
import target from "../images/target.svg"
import nggyu from "../images/nggyu.mp4"
import bg from "../images/front-page-bg.jpeg"
import "../style.css"

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
            
            <Row>
                <Col sm="12" lg="6">
                    <ListGroup>
                        <ListGroup.Item>
                            <ListGroup variant="flush">
                                <ListGroup.Item><b>Displays</b></ListGroup.Item>
                                <ListGroup.Item>Notes</ListGroup.Item>
                                <ListGroup.Item>Weather</ListGroup.Item>
                                <ListGroup.Item>Stocks</ListGroup.Item>
                                <ListGroup.Item>Calendar</ListGroup.Item>
                                <ListGroup.Item>Todo Lists</ListGroup.Item>
                            </ListGroup>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col sm="12" lg="6">
                    <img src={target} alt=""/>
                </Col>
            </Row>
            <Row style={{paddingTop: "0.5rem", paddingBottom: "0.5rem"}}>
                <Col>
                    <Player src={nggyu} preload="auto">
                        <BigPlayButton position="center" />
                        <ControlBar autoHide={true} autoHideTime={500}/>
                    </Player>
                </Col>
            </Row>
            
        </Container>
    )
}

export default HomePage