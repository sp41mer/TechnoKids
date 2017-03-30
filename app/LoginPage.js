/**
 * Created by sp41mer on 14.03.17.
 */
'use strict';

import React, {Component} from "react";
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
    InputGroup,
    Inout,
} from "native-base";
import {StyleSheet, TextInput, View, TouchableHighlight, ActivityIndicator, AsyncStorage, Image} from "react-native";
import {Actions} from "react-native-router-flux";
const Constants = require('./Constants');


export default class LoginPage extends Component {
    componentWillMount(){
        AsyncStorage.getItem("token").then((value) => {
            this.getUserInfo({from_token:{value: value}});
        });
    }

    componentDidMount() {
        AsyncStorage.getItem("token").then((value) => {
            this.setState({"token": value});
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            emailString: '',
            passwordString: '',
            isLoading: false,
            message: '',
            token: '',
        };
    }

    onUserNameInput(event) {
        console.log('onSearchTextChanged');
        this.setState({emailString: event.nativeEvent.text});
        console.log(this.state.emailString);
    }

    onPasswordInput(event) {
        console.log('onSearchTextChanged');
        this.setState({passwordString: event.nativeEvent.text});
        console.log(this.state.passwordString);
    }

    async getUserInfo({from_token = false}={}) {
        try {
            let response = await fetch(`${Constants.url}/me/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.state.token ? this.state.token : from_token.value
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
                    await AsyncStorage.setItem('user', JSON.stringify(responseJson));
                    Actions.task_list();
                }
            }
        } catch (error) {
            if (from_token){
                this.setState({
                    isLoading: false,
                    message: 'Кажется вы авторизовались через Постман :(. Чертов гений'
                });
            }
            else{
                this.setState({
                    isLoading: false,
                    message: 'Произошла ошибка' + error
                });
            }

        }

    }

    async onAuthPressed() {
        try {
            this.setState({isLoading: true});
            const response = await fetch(`${Constants.url}/login/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.emailString,
                    password: this.state.passwordString,
                })
            });
            console.log(response);
            const responseJson = await response.json();
            if (responseJson.error) {
                this.setState({
                    message: responseJson.error
                });
            } else {
                const token = `Token ${responseJson.token}`;
                await AsyncStorage.setItem('token', token);
                this.setState({token});
                const value = await AsyncStorage.getItem('token');
                if (value) {
                    console.log(value);
                }

            }
            this.getUserInfo();

        } catch (error) {
            this.setState({
                isLoading: false,
                message: 'Ошибка при авторизации ' + error
            })
        }
    }


    render() {
        let spinner = this.state.isLoading ?
            ( <ActivityIndicator
                size='large'/> ) :
            ( <View/>);
        return (
            <Container>
                <Header>
                    <Left/>
                    <Body>
                    <Title>Авторизация</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Image source={require('./Resources/house.png')} style={styles.image}/>
                    <Item borderWidth={0}>
                        <Input placeholder="Email"
                               onChange={this.onUserNameInput.bind(this)}
                               borderRadius={8}
                               borderWidth={0.2}
                               marginLeft={10}
                               marginRight={10}
                               padding={2}
                               textAlign={'center'}
                        />
                    </Item>
                    <Item borderWidth={0}>
                        <Input placeholder="Пароль"
                               secureTextEntry={true}
                               onChange={this.onPasswordInput.bind(this)}
                               borderRadius={8}
                               borderWidth={0.2}
                               marginTop={10}
                               marginLeft={10}
                               marginRight={10}
                               padding={2}
                               textAlign={'center'}
                        />
                    </Item>
                    {spinner}
                    <Text>{this.state.message}</Text>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button full
                                onPress={this.onAuthPressed.bind(this)}
                        >
                            <Text>Войти</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

let styles = StyleSheet.create({
    image: {
        width: 217,
        height: 138,
        marginTop: 30,
        alignSelf: 'center'
    }
});

module.exports = LoginPage;