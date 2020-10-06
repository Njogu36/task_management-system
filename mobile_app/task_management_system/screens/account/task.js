import React, { Component } from 'react';
import { StyleSheet, Switch, StatusBar, ScrollView, RefreshControl, KeyboardAvoidingView, ActivityIndicator, TextInput, View, Image, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import SearchInput, { createFilter } from 'react-native-search-filter';
import { FlatList } from 'react-native-gesture-handler';
import Data from './data'
import Icon from 'react-native-vector-icons/FontAwesome';


const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const KEYS_TO_FILTERS = ['status', 'type'];

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
            data: {},
            assign_to: [],
            user_id: ''
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
        let value = await AsyncStorage.getItem('User');
        let data = JSON.parse(value)

        this.setState({ data: Data.task.task, assign_to: Data.task.task.assigned_to, user_id: data._id })
        console.log(Data.task.task_id)


    }

    proceed = async () => {
        this.setState({ visible: true })

        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                fetch('https://task-system.herokuapp.com/api/progress/' + Data.task.task_id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then((res) => res.json())
                    .then(async (res) => {
                        if (res.success === true) {
                            setTimeout(() => {
                                this.props.navigation.navigate('Dashboard')
                                this.setState({ visible: false })
                                Data.task = {}
                            }, 1000)

                        }

                    })
                    .catch((err) => {
                        this.setState({ error: true, errorMessage: 'Network error. Try again later.', visible: false, log: false });
                    })
            }
            else {
                this.setState({ error: true, errorMessage: 'Enable your internet connection.', visible: false, log: false });

            }
        });
    }
    delete_task = async () => {
        this.setState({ visible: true })
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                fetch('https://task-system.herokuapp.com/api/delete_task/' + Data.task.task_id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then((res) => res.json())
                    .then(async (res) => {
                        if (res.success === true) {
                            setTimeout(() => {
                                Data.task = {}
                                this.props.navigation.navigate('Dashboard')
                                this.setState({ visible: false })
                            }, 1000)

                        }

                    })
                    .catch((err) => {
                        this.setState({ error: true, errorMessage: 'Network error. Try again later.', visible: false, log: false });
                    })
            }
            else {
                this.setState({ error: true, errorMessage: 'Enable your internet connection.', visible: false, log: false });

            }
        });

    }


    render() {
        const assign_to = Data.task.task.assigned_to
        const assignList = assign_to.map((item) => {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }} key={item.id}>
                    <View style={{ padding: 10 }}>
                        <Icon name='user' size={20} />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text>{item.full_name}</Text>
                    </View>
                </View>
            )
        })

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
                    <Text style={{ color: 'white', fontWeight: '700' }}>Task Details</Text>
                </View>

                <View style={{}}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ padding: 5 }}>
                                <Text style={{ fontSize: 9, fontWeight: '300' }}>Task | {this.state.data.type}</Text>
                            </View>
                            <View>
                                <Text style={styles.emailSubject1}>Priority: {this.state.data.priority}</Text>
                            </View>
                           
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text style={{ fontWeight: '600' }}>Title: {this.state.data.title} </Text>
                        </View>
                        <View style={{ padding: 10, marginTop: 0 }}>
                            <Text style={{ fontWeight: '600', fontSize: 13 }}>Description: {this.state.data.description} </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ padding: 10, marginTop: 0 }}>
                                <Text style={{ fontWeight: '300', fontSize: 10 }}>Start Date: {this.state.data.start_date} </Text>
                            </View>
                            <View style={{ padding: 10, marginTop: 0 }}>
                                <Text style={{ fontWeight: '300', fontSize: 10 }}>Start Time: {this.state.data.start_time} </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ padding: 10, marginTop: 0 }}>
                                <Text style={{ fontWeight: '300', fontSize: 10 }}>Due Date: {this.state.data.due_date} </Text>
                            </View>
                            <View style={{ padding: 10, marginTop: 0 }}>
                                <Text style={{ fontWeight: '300', fontSize: 10 }}>Due Time: {this.state.data.due_time} </Text>
                            </View>
                        </View>

                    </View>



                </View>




                <View style={{ backgroundColor: '#6777ef', padding: 10 }}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Assigned To:</Text>

                </View>

                <View>
                    {assignList}
                </View>


                <View style={{ backgroundColor: '#6777ef', padding: 10 }}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>Actions</Text>
                </View>
                <View style={{ marginTop: 10, padding: 10 }}>
                    {
                        this.state.user_id === this.state.data.user_id ?
                            <View>
                                {
                                    this.state.visible ?
                                        <View style={{ marginTop: 10 }}>
                                            <ActivityIndicator color='black' size={25} />
                                        </View>
                                        :
                                        <View>

                                        </View>
                                }
                                {
                                    this.state.data.status === 'COMPLETE' ?

                                        <View>
                                            <TouchableOpacity style={styles.join_button1} onPress={() => {
                                                this.delete_task().done()
                                            }}>
                                                <Text style={styles.join_button_text1}>DELETE</Text>
                                            </TouchableOpacity>
                                        </View> :
                                        <View>
                                            <TouchableOpacity style={styles.join_button} onPress={() => {
                                                this.proceed().done()
                                            }}>
                                                <Text style={styles.join_button_text}>PROCEED</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.join_button1} onPress={() => {
                                                this.delete_task().done()
                                            }}>
                                                <Text style={styles.join_button_text1}>DELETE</Text>
                                            </TouchableOpacity>
                                        </View>
                                }



                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12 }}>No actions available</Text>
                            </View>

                    }

                </View>






            </View>
        )


    }
}

const styles = StyleSheet.create({
    searchInput: {
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 3

    },
    emailItem: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
    },
    emailSubject1: {
        color: 'white',
        backgroundColor: 'black',
        alignItems: 'center',
        width: 80,
        fontSize: 10,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 5
    },
    join_button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#3abaf4',

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
    join_button1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#fc544b',

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
    join_button_text1: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white'
    },
})
