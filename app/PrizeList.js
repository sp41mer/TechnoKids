/**
 * Created by sp41mer on 19.03.17.
 */
import React, {Component} from "react";
import {StyleSheet, View, AsyncStorage, ListView, TouchableHighlight, Image, ActivityIndicator} from "react-native";
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
    Card,
    CardItem,
    Row, Col
} from "native-base";
import {Actions} from "react-native-router-flux";
import Swiper from "react-native-swiper";
const Constants = require('./Constants');
import * as Animatable from 'react-native-animatable';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-animated-modal'

class PrizeList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            prizes: '',
            isLoading: true,
            message: '',
            token: '',
            isModalVisible: false,
        };
    }

    componentDidMount() {
        AsyncStorage.getItem("token").then((value) => {
            this.setState({"token": value});
        }).done(() => {
                if (this.state.token) {
                    this.getPrizes();
                    this.getUserInfo();
                }
            }
        );
    }

    async getUserInfo() {
        try {
            let response = await fetch(`${Constants.url}/me/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.state.token
                }
            });
            const responseJson = await response.json();
            this.setState({
                isLoading: false,
            });
            if (responseJson.error) {
                this.setState({
                    message: responseJson.error
                });
            }
            else {
                if (responseJson.type!=1){
                    this.setState({
                        isLoading: false,
                        message: 'Вы авторизовались взрослым'
                    });
                }
                else {
                    this.setState({
                        user: responseJson
                    })
                }
            }
        } catch (error) {
                this.setState({
                    isLoading: false,
                    message: 'Произошла ошибка' + error
                });

        }

    }


    async getPrizes() {
        try {
            let response = await fetch(`${Constants.url}/prizes/`, {
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
                this.setState({
                    isLoading: false,
                    prizes: responseJson
                });
                console.log(this.state.prizes);
            }
        } catch (error) {
            console.log(error);
            this.setState({
                isLoading: true,
                message: 'Произошла ошибка ' + error
            });
        }

    }

    calculateProgress(cost, balance){
        let coef = balance/cost;
        coef > 1 ? coef = 1: coef = coef;
        return coef;
    }

    isPrizeUnable(cost, balance){
        let coef = balance/cost;
        return (coef < 1);
    }

    isAnimatable(cost, balance){
        let coef = balance/cost;
        debugger;
        if (coef < 1){
            return null;
        }
        else{
            return "pulse"
        }
    }

    buttonGetColor(cost, balance){
        let coef = balance/cost;
        if (coef < 1){
            return "gray";
        }
        else{
            return "green"
        }
    }

    async takePrize(id) {
        try {
            let response = await fetch(`${Constants.url}/prizes/${id}/`, {
                method: 'PATCH',
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
                console.log(responseJson);
                this.setState({
                    isModalVisible: true
                });
            }
        } catch (error) {
            console.log(error);
            this.setState({
                isLoading: true,
                message: 'Произошла ошибка ' + error
            });
        }

    }

    dropPrize(key, cost){
        this.setState({
            isModalVisible: false,
        });
        this.state.prizes.splice(key,1);
        this.state.user.balance = this.state.user.balance - cost;
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left/>
                    <Body>
                    <Title>Мои призы</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content
                    justifyContent='center'>
                    <Swiper showsPagination={false} height={400}>
                        {this.state.prizes ? this.state.prizes.map((item, key) => {
                            return (
                                <View key={key} style={{alignItems:'center'}}>
                                    <View style = {{zIndex: 0, alignItems:'center'}}>
                                    <Text>
                                        {item.name}
                                    </Text>
                                    <Progress.Bar progress={this.calculateProgress(item.cost, this.state.user.balance)} width={160} height={10} />
                                        <Text>
                                            {this.state.user.balance}/{item.cost}
                                        </Text>
                                    <Animatable.Image animation="pulse" easing="ease-out" iterationCount="infinite"
                                        source={require('./Resources/type_house.png')}
                                        style={{borderRadius: 90,width: 180, height: 180, marginTop: 10, borderWidth: 1.5}}
                                    />
                                    <Text style={{marginTop: 10}}>
                                        {item.description}
                                    </Text>
                                    <Button rounded success large disabled={this.isPrizeUnable(item.cost, this.state.user.balance)}
                                            style={{alignSelf: 'center', marginTop: 20, backgroundColor: this.buttonGetColor(item.cost, this.state.user.balance)}}
                                            onPress={()=>this.takePrize(item.id, this)}>
                                        <Text>
                                            Забрать !
                                        </Text>
                                    </Button>
                                    </View>
                                    { this.state.isModalVisible &&
                                    <Animatable.View animation="bounceInDown"
                                                     style={{
                                                             zIndex: 1,
                                                             position: 'absolute',
                                                             top: 60,
                                                             width: 250,
                                                             alignItems: 'center',
                                                             backgroundColor: 'rgba(50, 100, 255, 0.95)',
                                                             borderRadius: 20,
                                                             borderWidth: 3,
                                                             borderColor: '#d6d7da',
                                                         }}>
                                        <Text style={{
                                            marginTop: 20,
                                            marginHorizontal: 5,
                                            textAlign: 'center',

                                        }}>
                                            Поздравляем ! {"\n"}
                                            Ты забрал приз, осталось дождаться родителей с подарком !
                                        </Text>
                                        <Button rounded
                                                style={{alignSelf: 'center', marginTop: 40, marginBottom: 10}}
                                                onPress={()=>this.dropPrize(key, item.cost)}>
                                            <Text>
                                                Ура !
                                            </Text>
                                        </Button>
                                    </Animatable.View>
                                    }
                                </View>

                            )
                        }) :<ActivityIndicator
                                size='large'
                                color="#549fff"/>
                        }
                    </Swiper>
                </Content>
                <Footer >
                    <FooterTab>
                        <Button active>
                            <Icon name="camera"/>
                            <Text style={{fontSize: 10}}>Призы</Text>
                        </Button>
                        <Button onPress={()=>Actions.task_list()}>
                            <Icon name="apps"/>
                            <Text style={{fontSize: 10}}>Задачки</Text>
                        </Button>
                        <Button onPress={()=>Actions.stats_list()}>
                            <Icon name="apps"/>
                            <Text style={{fontSize: 10}}>Статистика</Text>
                        </Button>
                        <Button onPress={()=>Actions.dnevnik()}>
                            <Icon name="ios-school"/>
                            <Text style={{fontSize: 10}}>Дневник</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default PrizeList;