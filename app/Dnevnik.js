/**
 * Created by sp41mer on 01.06.17.
 */
import React, {Component} from "react";
import {StyleSheet, View, AsyncStorage, ListView, TouchableHighlight, ActivityIndicator, Platform} from "react-native";
import {
    Container,
    Content,
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
    Thumbnail
} from "native-base";
import {Actions} from "react-native-router-flux";
const Constants = require('./Constants');

class Dnevnik extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: '',
            marks: [],
            dataMarks: ''
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("token").then((value) => {
            this.setState({"token": value});
        }).done(() => {
                if (this.state.token) {
                    this.getUserMarks();
                }
            }
        );
    }

    async getUserMarks() {
        try {
            let response = await fetch(`${Constants.dnevnikUrl}id=${Constants.giveIdForKid(Constants.user_id)}&days=20170501-20170507`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.state.token
                }
            });
            const responseJson = JSON.parse(response._bodyText);
            if (responseJson.error) {
                this.setState({
                    message: responseJson.error
                });
            }
            else {
                let list_marks = responseJson;
                let dataSource = new ListView.DataSource(
                    {rowHasChanged: (r1, r2) => r1.id !== r2.id});
                this.setState({dataMarks: dataSource.cloneWithRows(list_marks)});
                console.log(this.state.dataMarks);
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
            <ListItem thumbnail button>
                <Left>
                    <Thumbnail source = {Constants.getMarkPicture(rowData.mark)}
                               circular={true}
                               borderRadius = {70}
                               borderWidth={1.5}
                               zIndex = {2}
                    />
                </Left>
                <Body>
                <Text>{rowData.name}</Text>
                {rowData.mark == 'н' ? <Text note> Прогул </Text>: <Text note>Оценка: {rowData.mark}</Text> }
                <Text>
                    <Icon name="star" style={{fontSize:15, color: '#ff21da'}}/> {rowData.count}
                    {rowData.mark != 'н' ? rowData.add ? <Icon name="arrow-up" style={{fontSize:15, color: '#11AF2C', marginLeft: 5}}/> :
                            <Icon name="arrow-down" style={{fontSize:15, color: '#ac1a1c'}}/> : false}
                </Text>
                </Body>
            </ListItem>
        );
    }

    render(){
        return (
            <Container>
                <Header>
                    <Left/>
                    <Body>
                    <Title>Дневник</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Text>
                        {this.state.message}
                    </Text>
                    {this.state.dataMarks ? <ListView
                            dataSource={this.state.dataMarks}
                            renderRow={this.renderRow.bind(this)}
                        />: <ActivityIndicator
                            size='large'
                            color="#549fff"/>  }
                </Content>
                <Footer >
                    <FooterTab>
                        <Button onPress={()=>Actions.prize_list()}>
                            <Icon name="camera"/>
                            <Text style={{fontSize: 10}}>Призы</Text>
                        </Button>
                        <Button>
                            <Icon name="apps" />
                            <Text style={{fontSize: 10}}>Задачки</Text>
                        </Button>
                        <Button onPress={()=>Actions.stats_list()}>
                            <Icon name="apps"/>
                            <Text style={{fontSize: 10}}>Статистика</Text>
                        </Button>
                        <Button active>
                            <Icon name="ios-school"/>
                            <Text style={{fontSize: 10}}>Дневник</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default Dnevnik;
