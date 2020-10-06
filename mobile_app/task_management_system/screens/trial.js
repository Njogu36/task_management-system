import React, { Component } from 'react';
import { StyleSheet, Switch, StatusBar, ScrollView,RefreshControl, KeyboardAvoidingView, ActivityIndicator, TextInput, View, Image, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { FlatList } from 'react-native-gesture-handler';
import Data from './data';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            visible: false,
            isEnabled: true,
            availability: 'On',
            success: false,
            error: false,
            successMessage: '',
            errorMessage: '',
            
            today: '',
            rider: {},
            deliveries:[]
        };
    }
    componentDidMount() {
        this.get_today()
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.get_today()
            }
          );
        }
      
        componentWillUnmount() {
         this.willFocusSubscription();
       }
      
    get_today = async () => {
        this.setState({refreshing:true})
        const date = new Date();
        const year = date.getFullYear();
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const today = year + "-" + month + "-" + day;
        const value = await AsyncStorage.getItem('Rider');
        const data = JSON.parse(value)
        this.setState({ today: today, rider: data,refreshing:false });
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                fetch('https://task-system.herokuapp.com/api/' + data._id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then((res) => res.json())
                    .then(async (res) => {
                        if (res.success === true) {
                            AsyncStorage.removeItem('Deliveries');
                            await AsyncStorage.setItem('Deliveries', JSON.stringify(res.deliveries));
                            this.setState({deliveries:res.deliveries,refreshing:false})
                        }
                       
                    })
                    .catch((err) => {
                        this.setState({ error: true, errorMessage: 'Network error. Try again later.', visible: false,refreshing:false });
                    })
            }
            else {
                this.setState({ error: true, errorMessage: 'Enable your internet connection.', visible: false,refreshing:false });

            }
        });

    }
    toggleSwitch = async () => {
        this.setState({ isEnabled: !this.state.isEnabled })
        const value = await AsyncStorage.getItem('Rider');
        const data = JSON.parse(value)
        if (this.state.isEnabled) {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    fetch('https://sadiq-solutions.herokuapp.com/v1/api/true/' + data._id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                        .then((res) => res.json())
                        .then(async (res) => {
                            if (res.success === true) {
                                AsyncStorage.removeItem('Rider');
                                await AsyncStorage.setItem('Rider', JSON.stringify(res.rider));
                                this.setState({ availability: 'On' })

                            }
                            else if (res.success === false) {
                                this.setState({ error: true, errorMessage: res.message, visible: false });
                            }
                        })
                        .catch((err) => {
                            this.setState({ error: true, errorMessage: 'Network error. Try again later.', visible: false });
                        })
                }
                else {
                    this.setState({ error: true, errorMessage: 'Enable your internet connection.', visible: false });

                }
            });

        }
        else {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    fetch('https://sadiq-solutions.herokuapp.com/v1/api/false/' + data._id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    })
                        .then((res) => res.json())
                        .then(async (res) => {
                            if (res.success === true) {
                                AsyncStorage.removeItem('Rider');
                                await AsyncStorage.setItem('Rider', JSON.stringify(res.rider));
                                this.setState({ availability: 'Off' })

                            }
                            else if (res.success === false) {
                                this.setState({ error: true, errorMessage: res.message, visible: false });
                            }
                        })
                        .catch((err) => {
                            this.setState({ error: true, errorMessage: 'Network error. Try again later.', visible: false });
                        })
                }
                else {
                    this.setState({ error: true, errorMessage: 'Enable your internet connection.', visible: false });

                }
            });
        }
    };
    _onRefresh = () => {
        this.get_today()
    
      }


    render() {

        return (
            <View >
                <StatusBar backgroundColor={'white'} />
                {
                    this.state.success ?
                        <View style={{ backgroundColor: 'green', padding: 10, marginBottom: 0 }}>
                            <Text style={{ color: 'white', fontWeight: '700' }}>{this.state.successMessage}</Text>
                        </View>
                        :
                        <View></View>
                }
                {
                    this.state.error ?
                        <View style={{ backgroundColor: 'red', padding: 10, marginBottom: 0 }}>
                            <Text style={{ color: 'white', fontWeight: '700' }}>{this.state.errorMessage}</Text>
                        </View>
                        :
                        <View></View>
                }
                <View style={{ backgroundColor: 'gray', padding: 10 }}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Rider Details</Text>
                </View>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontWeight: '600' }}>Full Name: {this.state.rider.first_name} {this.state.rider.last_name} </Text>
                </View>
                <View style={{ padding: 10,marginTop:2 }}>
                    <Text style={{ fontWeight: '600' }}>Phone No# {this.state.rider.phone_no}</Text>
                </View>
                <View style={{ backgroundColor: 'gray', padding: 10 }}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Availability - {this.state.today}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Switch
                        trackColor={{ false: "#767577", true: "gray" }}
                        thumbColor={this.state.isEnabled ? "green" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleSwitch}
                        value={this.state.isEnabled}
                    />
                    <Text style={{ margin: 10, fontWeight: '700' }}>{this.state.availability}</Text>

                </View>

                <View style={{ backgroundColor: 'gray', padding: 10 }}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Your Deliveries</Text>
                </View>
                {
                    this.state.deliveries.length === 0?
                    <View style={{flex:1,justifyContent:'center',alignItems:"center",marginTop:30}}>
                        <Text style={{fontWeight:'700'}}>You have no deliveries today.</Text>
                    </View>
                    :
                    <FlatList
                    contentContainerStyle={{ paddingBottom: 160 }}
                  showsVerticalScrollIndicator={false}
                  refreshControl={<RefreshControl
                    colors={["#9Bd35A", "#689F38"]}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)} />}
                  data={this.state.deliveries}
                  renderItem={({ item,index }) => (
                    <TouchableOpacity onPress={() => {
                      this.props.navigation.navigate('Delivery Details')
                      Data.order = item
                      
                    }} style={{marginTop:5}}>
                      <View style={
                         item.status !== 'Ongoing Delivery'? 
                          {
                        flex: 1, flexDirection: 'row',
                        justifyContent:'space-between',
                       
                        width: (Dimensions.get('window').width ) ,
                        padding:10,backgroundColor: 'white'
                      }:{
                        flex: 1, flexDirection: 'row',
                        justifyContent:'space-between',
                        opacity:0.5,
                        width: (Dimensions.get('window').width ) ,
                        padding:10,backgroundColor: 'gray'
                      }}>
                          <View style={{margin:0}}>
                          
                    <Text style={{backgroundColor:'black',padding:5,color:'white',marginTop:4}}>{index + 1}</Text>
                          </View>
                          <View style={{marginRight:40}}>
                          
                          <Text>Order No# {item.order_details.no}</Text>
                          <Text>Delivery Date:  {item.order_details.delivered_on}</Text>
                          {
                              item.status === 'Complete'?

                              <Text style={{fontWeight:'700',fontSize:13,color:'green'}}>Status:  {item.status}</Text>
                          
                              :
                              <Text style={{fontWeight:'700',fontSize:13,color:'red'}}>Status:  {item.status}</Text>
                          
                          }
                         
                          </View>
                          <View>
                          
                          <Text style={{fontSize:10,backgroundColor:'green',padding:5,color:'white',marginTop:4}}>Today</Text>
                          </View>
                   
                        
                      </View>


                    </TouchableOpacity>
                  )}
                  numColumns={1}
                  keyExtractor={item => item._id}

                    />
                }
               



            </View>
        )


    }
}

const styles = StyleSheet.create({

})
