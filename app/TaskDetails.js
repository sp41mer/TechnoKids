/**
 * Created by sp41mer on 18.03.17.
 */
import React, {Component} from "react";
import { Image, AsyncStorage } from 'react-native';
import {
    Container, Content,
    Card, CardItem, Left,
    Body, Thumbnail, Text,
    Button, Icon, Header,
    Title, Right, Grid, Col, Row} from 'native-base';
import {Actions} from "react-native-router-flux";
const Constants = require('./Constants');


export default class TaskDetails extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        AsyncStorage.getItem("token").then((value) => {
            this.setState({"token": value});
        })
    }

    async makeTaskDone(taskID, newThis){
        try {
            let response = await fetch(`${Constants.url}/tasks/${taskID}/`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': newThis.state.token
                },
                body: JSON.stringify({
                    status: 1,
                })

            });
            const responseJson = await response.json();
            if (responseJson.error) {
                newThis.setState({
                    message: responseJson.error
                });
            }
            else {
                Actions.task_list()
            }
        }
        catch (error) {
            newThis.setState({
                isLoading: false,
                message: 'Something bad happened ' + error
            });
        }
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent
                                onPress={()=>Actions.pop()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                    <Title>Задачка</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content
                    justifyContent='center'
                    alignItems='center'>
                    <Card >
                        <CardItem marginBottom={20}>
                            <Left/>
                            <Body>
                                <Text>{this.props.task.cost} звёздочек</Text>
                            </Body>
                            <Right/>
                        </CardItem>
                        <CardItem cardBody>
                            <Row marginTop={20}>
                                <Col alignItems='flex-end'
                                     marginRight={-25}>
                                <Image
                                    source={Constants.getDefaultTaskType(this.props.task.type_info)}
                                    style={{borderRadius: 90,width: 180, height: 180}}
                                    borderWidth={1.5}
                                />
                                </Col>
                                <Col alignItems='flex-start'
                                     marginLeftt={-25}>
                                <Image
                                    source={Constants.getDefaultAvatar(this.props.task.customer_info)}
                                    borderWidth={1.5}
                                    style={{borderRadius: 90, width: 180, height: 180}}/>
                                </Col>
                            </Row>
                        </CardItem>
                        <CardItem marginBottom={20} style={{minWidth:350}}>
                            <Text>{this.props.task.description}</Text>
                        </CardItem>
                    </Card>
                    <Button rounded success large
                            style={{
                                alignSelf: 'center',
                                marginTop: 10
                            }}
                            onPress={()=>this.makeTaskDone(this.props.task.id, this)}
                    >
                        <Text>
                            Я сделал !
                        </Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}