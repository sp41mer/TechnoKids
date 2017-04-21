/**
 * Created by sp41mer on 16.03.17.
 */
import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import LoginPage from './LoginPage';
import TaskList from './TaskList';
import TaskDetails from './TaskDetails';
import PrizeList from './PrizeList';
import StatsList from './Statistics'

const App = () => {
    return (
        <Router>
            <Scene key="root">
                <Scene key="login"
                       component={LoginPage}
                       initial
                       hideNavBar={true}
                />
                <Scene key="task_list"
                       component={TaskList}
                >
                </Scene>
                <Scene
                    key="task_details"
                    component={TaskDetails}>
                </Scene>
                <Scene
                    key="prize_list"
                    direction='leftToRight'
                    component={PrizeList}>
                </Scene>
                <Scene
                    key="stats_list"
                    component={StatsList}>
                </Scene>
            </Scene>
        </Router>
    );
};

export default App;