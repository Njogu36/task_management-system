import React, { Component } from 'react';
import { StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, ActivityIndicator, TextInput, View, Image, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import Data from '../account/data'
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const primary_color = '#000000';
const secondary_color = '#FFFFFF';
const final_color = '#d5f70d'
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            email: '',
            password: '',
            error: false,
            success: false,
            errorMessage: '',
            successMessage: '',
        };
    }

    // Functions
    componentDidMount() {

        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.check_rider()
            }
          );
     
    }
    componentWillUnmount() {
        this.willFocusSubscription();
      }
    
    
    check_rider = async ()=>{
        let value = await AsyncStorage.getItem('User');
       
        if(value===null)
        {
            this.props.navigation.navigate('Log In')
        }
        else
        {
            this.props.navigation.navigate('Dashboard')
        }
       

    }

    log_in = async () => {

        this.setState({ error: false, success: false, visible: true })
        if (this.state.email === '') {
            this.setState({ error: true, errorMessage: 'Email is required.', visible: false })
        }
        
        else if (this.state.password === '') {
            this.setState({ error: true, errorMessage: 'Password is required.', visible: false })
        }
        else {
          NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
            Data.email = this.state.email
          fetch('https://task-system.herokuapp.com/api/user_login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                  email: this.state.email,
                  password: this.state.password
              })
          })
          .then((res) => res.json())
          .then(async (res) => {
              if (res.success === true) {
                 
                  this.props.navigation.navigate("Verify");
                  
                  this.setState({visible:false });
              }
              else if (res.success === false) {
                  this.setState({ error: true, errorMessage: res.message,visible:false });
              }
          })
          .catch((err) => {
              this.setState({ error: true, errorMessage: 'Network error. Try again later.',visible:false });
          })
        }
        else {
          this.setState({ error: true, errorMessage: 'Enable your internet connection.',visible:false });

        }
});



        }

    }

    render() {

        return (
            <View style={styles.container}>
                <ScrollView >
                    <StatusBar backgroundColor={'#6777ef'} />
                    {
                        this.state.success ?
                            <View style={{ backgroundColor: 'green', padding: 10, marginBottom: 5 }}>
                                <Text style={{ color: 'white', fontWeight: '700' }}>{this.state.successMessage}</Text>
                            </View>
                            :
                            <View></View>
                    }
                    {
                        this.state.error ?
                            <View style={{ backgroundColor: 'red', padding: 10, marginBottom: 5 }}>
                                <Text style={{ color: 'white', fontWeight: '700' }}>{this.state.errorMessage}</Text>
                            </View>
                            :
                            <View></View>
                    }
                    <View style={{ marginTop: 80, justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 18 }}>Welcome Back</Text>
                        <Text style={{ fontWeight: '300', fontSize: 12,marginTop:10 }}>Task Management System</Text>
                    </View>
                    <KeyboardAvoidingView behavior='padding' style={styles.form_input}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(email) => {
                                this.setState({ email: email })
                            }}
                            value={this.state.email}
                            placeholder={'ENTER EMAIL'}
                            keyboardType={'email-address'}
                        />

                        <TextInput
                            style={styles.input}
                            onChangeText={(password) => {
                                this.setState({ password: password })
                            }}
                            value={this.state.password}
                            secureTextEntry={true}
                            placeholder={'PASSWORD'}
                            
                        />
                        {
                            this.state.visible ?
                                <View style={{ marginTop: 10 }}>
                                    <ActivityIndicator color='black' size={25} />
                                </View>
                                :
                                <View>

                                </View>
                        }
                        <TouchableOpacity style={styles.join_button} onPress={() => {
                            this.log_in().done()
                        }}>
                            <Text style={styles.join_button_text}>LOGIN</Text>
                        </TouchableOpacity>
                       


                    </KeyboardAvoidingView>


                </ScrollView>
            </View>
        )


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'white',
        height: HEIGHT
    },

    user_count: {
        flexDirection: 'row',
        justifyContent: 'flex-start',

    },
    form_input:
    {
        width: WIDTH - 20,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,


    },
    input: {
        height: 50,
        borderColor: 'black',
        borderWidth: 2,

        paddingLeft: 30,
        marginTop: 10

    },
    join_button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#6777ef',

        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,


    },
    join_button_text: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white'
    },
})
