/**
 * Created by sp41mer on 16.03.17.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    ListView,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Header,
    Title,
    Left,
    Right,
    Body,
    Footer,
    Button,
    FooterTab,
    Text,
    Icon,
    ListItem,
    Thumbnail,
    List
} from "native-base";
import {Actions} from "react-native-router-flux";
const Constants = require('./Constants');


class TaskList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: '',
            tasks: [],
            dataTasks: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("token").then((value) => {
            this.setState({"token": value});
        }).done(() => {
                if (this.state.token) {
                    this.getUserTasks();
                }
            }
        );
    }

    async getUserTasks() {
        try {
            let response = await fetch(`${Constants.url}/tasks/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.state.token
                }
            });
            const responseJson = await response.json();
            if (responseJson.error) {
                this.setState({
                    message: responseJson.error
                });
            }
            else {
                let list_tasks = responseJson[0].tasks;
                let dataSource = new ListView.DataSource(
                    {rowHasChanged: (r1, r2) => r1.id !== r2.id});
                this.setState({dataTasks: dataSource.cloneWithRows(list_tasks)});
                console.log(this.state.tasks);
            }
        }
        catch (error) {
            this.setState({
                isLoading: false,
                message: 'Something bad happened ' + error
            });
        }
    }

    renderRow(rowData, sectionID, rowID) {
        return (
                <ListItem thumbnail button
                          onPress={()=>this.onClickRow(rowData, rowID, this.props.tasks_list)}>
                    <Left>
                        <Thumbnail source = {Constants.getDefaultAvatar(rowData.customer_info)}
                                   circular={50}
                                   borderRadius = {50}
                                   marginRight = {-20}
                                   borderWidth={1.5}
                                   zIndex = {2}
                        />
                        <Thumbnail source = {Constants.getDefaultTaskType(rowData.type_info)}
                                   circular={50}
                                   borderRadius = {50}
                                   borderWidth={1.5}
                                   zIndex = {1}
                        />
                    </Left>
                    <Body>
                    <Text>{rowData.title} {Constants.taskMessagesToKid[rowData.status]}</Text>
                    <Text note>{rowData.type_info.name}</Text>
                    <Text>
                        {rowData.cost}
                    </Text>
                    </Body>
                </ListItem>
        );
    }

    onClickRow(rowData, rowID, allTasks){
        console.log(rowData);
        Actions.task_details({
            task: rowData,
            id: rowID,
            tasks: allTasks,
        });
    }

    render(){
        return (
            <Container>
                <Header>
                    <Left/>
                    <Body>
                    <Title>Мои задачки</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Text>
                        {this.state.message}
                    </Text>
                    {this.state.dataTasks ? <ListView
                            dataSource={this.state.dataTasks}
                            renderRow={this.renderRow.bind(this)}
                        />: <ActivityIndicator
                            size='large'
                            color="#549fff"/>  }
                    </Content>
                <Footer >
                    <FooterTab>
                        <Button onPress={()=>Actions.prize_list()}>
                            <Icon name="camera"/>
                            <Text>Призы</Text>
                        </Button>
                        <Button active>
                            <Icon name="apps" />
                            <Text>Задачки</Text>
                        </Button>
                        <Button onPress={()=>Actions.stats_list()}>
                            <Icon name="apps"/>
                            <Text>Статистика</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default TaskList;
