import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
import { render } from "@testing-library/react";



class MyBoot extends React.Component {
    constructor(props) {
        super(props);
   };
    
    
    render(){
        return (
            <div>
                <Container>
                    <Row>
                        <Col lg={4}>side</Col>
                        <Col lg={8}>map</Col>
                    </Row>
        
                </Container>
            </div>



    )

    }}
    

    export default MyBoot
    
    
    