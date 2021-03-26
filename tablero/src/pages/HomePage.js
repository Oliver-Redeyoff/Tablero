import { Container, Row, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from "shards-react";
import sushi from "../images/sushi-food.svg"
import target from "../images/target.svg"
import nggyu from "../images/nggyu.mp4"

function HomePage() {
    return (
        <Container>
            <Row>
                <Col>
                    <img src={sushi} alt=""/>
                </Col>
                <Col> {/* TODO: Centre this with the image */}
                    <p>Minimalist, modern and environmentally conscious</p>
                </Col>
            </Row>
            <Row>
                <Col>
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
                <Col>
                    <img src={target} alt=""/>
                </Col>
            </Row>
            <Row>
                <video src={nggyu}></video>
            </Row>
            
        </Container>
    )
}

export default HomePage