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

export default class Verify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            code: 0,
            email:'',
            error: false,
            success: false,
            errorMessage: '',
            successMessage: '',
        };
    }

    // Functions
    componentDidMount() {


     this.get_user()
    }
    
    
    get_user = async ()=>{
       
           
            this.setState({email:Data.email})
            console.log(Data)
        
       

    }

    verify = async () => {
        let value = await AsyncStorage.getItem('User');
        let data = JSON.parse(value);
        this.setState({ error: false, success: false, visible: true })
        if (this.state.code === 0) {
            this.setState({ error: true, errorMessage: 'Verification code is required.', visible: false })
        }
        
        
        else {
          NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('https://task-system.herokuapp.com/api/verification_code/'+Data.email, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                  code: this.state.code,
                 
              })
          })
          .then((res) => res.json())
          .then(async (res) => {
              if (res.success === true) {
                  AsyncStorage.removeItem('User');
                  await AsyncStorage.setItem('User',JSON.stringify(res.user));
                  this.props.navigation.navigate("Dashboard");
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
                    <View style={{ marginTop: 80,  flex: 1,padding:10 }}>
                        <Text style={{ fontWeight: '700', fontSize: 18 }}>Enter Verification Code</Text>
                <Text style={{ fontWeight: '300', fontSize: 12,marginTop:5 }}>Your verification code has been sent to: {this.state.email}</Text>
                    </View>
                    <KeyboardAvoidingView behavior='padding' style={styles.form_input}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(code) => {
                                this.setState({ code: code })
                            }}
                            value={this.state.code}
                            placeholder={'ENTER VERIFICATION CODE'}
                            keyboardType={'number-pad'}
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
                            this.verify().done()
                        }}>
                            <Text style={styles.join_button_text}>VERIFY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.join_button2} onPress={() => {
                            AsyncStorage.removeItem('User');
                            this.props.navigation.navigate('Log In')
                        }}>
                            <Text style={styles.join_button_text}>GO BACK</Text>
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
