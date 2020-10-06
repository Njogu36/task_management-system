import React, { Component } from 'react';
import { StyleSheet, Switch, StatusBar, ScrollView, RefreshControl, KeyboardAvoidingView, ActivityIndicator, TextInput, View, Image, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import SearchInput, { createFilter } from 'react-native-search-filter';
import { FlatList } from 'react-native-gesture-handler';
import Data from './data'

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const KEYS_TO_FILTERS = ['status', 'type','title'];

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            visible: false,
            log: false,
            isEnabled: true,
            availability: 'On',
            success: false,
            error: false,
            successMessage: '',
            errorMessage: '',
            searchTerm: '',

            today: '',
            user: {},
            tasks: []
        };
    }
    componentDidMount() {
        this.get_tasks()
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
                this.get_tasks()
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription();
    }

    get_tasks = async () => {
        this.setState({ log: true })
        const date = new Date();
        const year = date.getFullYear();
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const today = year + "-" + month + "-" + day;
        const value = await AsyncStorage.getItem('User');
        const data = JSON.parse(value)
        this.setState({ today: today, user: data, refreshing: true });
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                fetch('https://task-system.herokuapp.com/api/assigned_task/' + data._id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then((res) => res.json())
                    .then(async (res) => {
                        if (res.success === true) {
                            AsyncStorage.removeItem('Tasks');
                            await AsyncStorage.setItem('Tasks', JSON.stringify(res.tasks));
                            this.setState({ tasks: res.tasks, log: false,refreshing:false })
                        }

                    })
                    .catch((err) => {
                        this.setState({ error: true, errorMessage: 'Network error. Try again later.', visible: false, log: false,refreshing:false });
                    })
            }
            else {
                this.setState({ error: true, errorMessage: 'Enable your internet connection.', visible: false, log: false,refreshing:false });

            }
        });

    }

    _onRefresh = () => {
        this.get_tasks()
        

    }
    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }


    render() {
        const filteredEmails = this.state.tasks.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))


        return (
            <View >
                <StatusBar backgroundColor={'#6777ef'} />
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
                <View style={{ backgroundColor: '#6777ef', padding: 10 }}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>User Details</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: '600' }}>Full Name: {this.state.user.first_name} {this.state.user.last_name} </Text>
                        </View>
                        <View style={{ padding: 10, marginTop: 2 }}>
                            <Text style={{ fontWeight: '600' }}>Email: {this.state.user.username}</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => {
                            this.setState({ log: true })
                            AsyncStorage.removeItem('User');
                            this.props.navigation.navigate('Log In')
                            this.setState({ log: false })
                        }} style={{
                            marginRight: 10, marginTop: 10, backgroundColor: 'red', padding: 3, paddingLeft: 4, paddingRight: 4, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,

                            elevation: 5,
                        }}>
                            <Text style={{ color: 'white' }}>Log out</Text>

                        </TouchableOpacity>
                        {
                            this.state.log ?
                                <View style={{ marginTop: 10, marginRight: 10 }}>
                                    <ActivityIndicator color='black' size={20} />
                                </View>
                                :
                                <View style={{ marginTop: 10, marginRight: 10 }}>

                                </View>
                        }
                    </View>



                </View>




                <View style={{ backgroundColor: '#6777ef', padding: 10 }}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Your Assigned Tasks: {this.state.tasks.length}</Text>

                </View>
                {
                    this.state.tasks.length === 0 ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", marginTop: 30 }}>
                            <Text style={{ fontWeight: '700' }}>You have no assigned tasks.</Text>
                        </View>
                        :
                       
                            <View style={{padding:5}}>
                            <SearchInput
                                onChangeText={(term) => { this.searchUpdated(term) }}
                                style={styles.searchInput}
                                placeholder="Search for a specific task by status"
                            />
                             <ScrollView 
                              refreshControl={
                                <RefreshControl
                                    tintColor={'black'}
                                    onRefresh={() => this._onRefresh()}
                                    refreshing={this.state.refreshing}
                                />
                            }>
                             {filteredEmails.map(item => {
                                return (
                                <TouchableOpacity onPress={()=>{
                                    
                                    Data.task = item
                                    this.props.navigation.navigate('Task');
                                   
                                }} key={item._id} style={styles.emailItem}>
                                    <View>
                                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                          <View>
                                          <Text style={{fontSize:9,fontWeight:'300'}}>Task | {item.type}</Text>
                                          </View>
                                          <View>
                                                {
                                                    item.status === 'TO DO'?
                                                <Text style={{fontSize:9,fontWeight:'300',backgroundColor:'#6777ef',color:'white',padding:2}}>Status: {item.status}</Text>
                                                    :
                                                    <View></View>
                                                }
                                                {
                                                    item.status === 'IN PROGRESS'?
                                                <Text style={{fontSize:9,fontWeight:'300',backgroundColor:'#3abaf4',color:'white',padding:2}}>Status: {item.status}</Text>
                                                    :
                                                    <View></View>
                                                }
                                                {
                                                    item.status === 'REVIEW'?
                                                <Text style={{fontSize:9,fontWeight:'300',backgroundColor:'#fc544b',color:'white',padding:2}}>Status: {item.status}</Text>
                                                    :
                                                    <View></View>
                                                }
                                                {
                                                    item.status === 'REVISION'?
                                                <Text style={{fontSize:9,fontWeight:'300',backgroundColor:'#ffa426',color:'white',padding:2}}>Status: {item.status}</Text>
                                                    :
                                                    <View></View>
                                                }
                                                {
                                                    item.status === 'COMPLETE'?
                                                <Text style={{fontSize:9,fontWeight:'300',backgroundColor:'#66bb6a',color:'white',padding:2}}>Status: {item.status}</Text>
                                                    :
                                                    <View></View>
                                                }
                                          </View>
                                      </View>
                           
                                    <Text style={{fontWeight:'700',marginTop:3}}>{item.task.title}</Text>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <Text style={styles.emailSubject1}>Priority: {item.task.priority}</Text>
                            <Text style={styles.emailSubject2}>{item.task.start_date} | {item.task.due_date}</Text>
                                    </View>
                                    <Text style={{fontWeight:'300',marginTop:6,fontSize:9}}>Assignee: {item.task.created_by}</Text>
                                    
                                 </View>
                                </TouchableOpacity>
                                )
                            })}
                             </ScrollView>
                            </View>
                           
                       
                }




            </View>
        )


    }
}

const styles = StyleSheet.create({
    searchInput:{
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        marginTop:3
        
      },
      emailItem:{
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
      },
      emailSubject1: {
        color: 'white',
        backgroundColor:'black',
        width:80,
        fontSize:10,
        paddingLeft:5,
        paddingRight:5,
        marginTop:5
      },
      emailSubject2: {
        color: 'white',
        backgroundColor:'black',
      
        fontSize:10,
        paddingLeft:5,
        paddingRight:5,
        marginTop:5
      },
})
