/**
 * Created by sp41mer on 16.03.17.
 */
export default function onAuthPressed() {
    this.setState({isLoading: true});
    fetch('http://0.0.0.0:8000/login/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: this.state.emailString,
            password: this.state.passwordString,
        })
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.error) {
                this.setState({
                    message: responseJson.error
                });
            }
            else {
                setItem('token', 'Token ' + responseJson.token);
                try {
                    const value = getItem('token').then((value) => {
                            if (value !== null) {
                                // We have data!!
                                console.log(value);
                            }
                        }
                    );
                }
                catch (error) {
                    console.log('AsyncStorage error: ' + error.message);
                }
            }
            this.getUserInfo();

        })
        .catch((error) =>
            this.setState({
                isLoading: false,
                message: 'Something bad happened ' + error
            }));
};
