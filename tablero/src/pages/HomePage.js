import { Container, Row, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from "shards-react";
import {Player, BigPlayButton} from 'video-react'
import sushi from "../images/sushi-food.svg"
import target from "../images/target.svg"
import nggyu from "../images/nggyu.mp4"
import ControlBar from "video-react/lib/components/control-bar/ControlBar";

function HomePage() {
    return (
        <Container fluid>
            <Row style={{height: "100%"}}>
                <Col sm="12" lg="6" >
                    <img src={sushi} alt=""/>
                </Col>
                <Col sm="12" lg="6"> {/* TODO: Centre this with the image */}
                    <p>Minimalist, modern and environmentally conscious</p>
                </Col>
            </Row>
            <Row>
                <Col sm="12" lg="6">
                    <ListGroup>
                        <ListGroupItem>
                            <ListGroupItemHeading>Displays</ListGroupItemHeading>
                            <ListGroupItemText>Notes</ListGroupItemText>
                            <ListGroupItemText>Weather</ListGroupItemText>
                            <ListGroupItemText>Stocks</ListGroupItemText>
                            <ListGroupItemText>Calendar</ListGroupItemText>
                            <ListGroupItemText>Todo Lists</ListGroupItemText>
                        </ListGroupItem>
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