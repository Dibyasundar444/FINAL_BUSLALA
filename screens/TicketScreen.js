import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RalewayBold } from '../assets/fonts/fonts';
import { fontColor, newColor, primary, secondary, textColor } from '../components/Colors';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTheme } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { API } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width,height} = Dimensions.get("window");

const TicketScreen = () => {

    const navigation = useNavigation();
    const colors = useTheme();
    const isFocused = useIsFocused();
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // let tempDate = new Date(date);
    // let year = tempDate.getFullYear();
    // let month = ('0' + (tempDate.getMonth()+1)).slice(-2);
    // let day = ('0' + tempDate.getDate()).slice(-2); 
    // let fDate = `${year}-${month}-${day}`;

    const ticketApi=async()=>{
        const user = await AsyncStorage.getItem("jwt");
        const userToken = JSON.parse(user);
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization": userToken.data.token,
            }
        };
        axios.get(`${API}/booking`,axiosConfig)
        .then(res=>{
            if(res.status===200){
                const Data = res.data;
                setData(Data.data);
                setLoading(false);
            }else console.log(res.status);
        })
        .catch(e=>{
            console.log(e);
            alert("please try again later");
        })
    };
    

    useEffect(() => {
        if(isFocused){
            const interval = setInterval(() => {
                ticketApi();
            }, 3000);
            return()=> clearInterval(interval)
        }
    },[isFocused]);

    return (
        <View style={styles.screen}>
            <View style={styles.view}>
                <View style={styles.heading}>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn}
                        onPress={()=>navigation.navigate("Profile")}
                        >
                            <MaterialCommunityIcons
                            name="account-outline"
                            size={30}
                            color="white"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn}>
                            <AntDesign
                            name="calendar"
                            size={30}
                            color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn}
                        onPress={()=>navigation.navigate("Notifications")}
                        >
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <MaterialIcons
                                name="notifications-none"
                                size={30}
                                color="white"
                                />
                                <View style={styles.dot}></View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.view2}>
                <View style={{flexDirection:"row",elevation:5,alignItems:"center", width:"100%", backgroundColor:"white", justifyContent:"space-between", borderRadius:10, padding:10}}>
                    <TouchableOpacity 
                        style={{backgroundColor:"#fff",elevation:5,borderRadius:5}}
                        onPress={()=>navigation.goBack()}
                    >
                        <AntDesign
                            name="arrowleft"
                            size={24}
                            color="black"
                            style={{padding:3}}
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily:RalewayBold, fontSize:17, color:"black",marginRight:30}}>Your Tickets</Text>
                </View>

                <ScrollView style={styles.notifications} showsVerticalScrollIndicator={false}>
                    {
                        loading ? <ActivityIndicator color="blue" style={{marginTop:40}} size={40} />
                        :
                        data.reverse().map((item,index)=>(
                            <View key={index}>
                            {
                                item.status === "completed" ? 
                                <View style={{elevation:5,backgroundColor:"#e9f7f7",borderRadius:10,marginHorizontal:10,marginVertical:10,overflow:"hidden"}} key={index}>
                                    <View style={{marginVertical:10}}>
                                        <View style={{position:"absolute",right:20}}>
                                            <Text style={{color:"blue",fontSize:12}}>{item.payment_status}</Text>
                                        </View>
                                        <Text style={{color:"#000",textAlign:"center",fontWeight:"bold"}}>{item.tripId.busId.name}</Text>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                                            <Text style={{color:"#000",fontWeight:"500"}}>{item.tripId.sourceId.name}</Text>
                                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                                <Text style={{color:"#eb8634",fontSize:11}}>-----</Text>
                                                <AntDesign name="right" color="#eb8634" style={{top:1,left:-2}} />
                                                <Text style={{color:"#eb8634",fontSize:11,marginHorizontal:5}}>{item.tripId.type}</Text>
                                                {
                                                    item.tripId.retime ? 
                                                    <>
                                                        <AntDesign name="left" color="#eb8634" style={{top:1,left:2}} />
                                                        <Text style={{color:"#eb8634",fontSize:11,}}>-----</Text>
                                                    </> 
                                                    :
                                                    <>
                                                        <Text style={{color:"#eb8634",fontSize:11,left:2}}>-----</Text>
                                                        <AntDesign name="right" color="#eb8634" style={{top:1}} />
                                                    </>
                                                }
                                            </View>
                                            <Text style={{color:"#000",fontWeight:"500"}}>{item.tripId.destinationId.name}</Text>
                                        </View>
                                        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",marginTop:10}}>
                                            <View style={{alignItems:"center"}}>
                                                <Text style={{color:"#000",fontSize:10}}>Reporting Time</Text>
                                                <Text style={{color:"#000",fontSize:14}}>{item.tripId.time.dept}</Text>
                                            </View>
                                            <View style={{alignItems:"center"}}>
                                                {
                                                    item.tripId.date ? 
                                                    <Text style={{textAlign:"center",color:"#000",fontSize:12}}>{JSON.stringify(item.tripId.date).slice(0,JSON.stringify(item.tripId.date).indexOf("T")).replace(/"/g,'')}</Text>
                                                    :
                                                    <Text style={{textAlign:"center",color:"#000",fontSize:12}}>{JSON.stringify(item.tripId.deptDate).slice(0,JSON.stringify(item.tripId.deptDate).indexOf("T")).replace(/"/g,'')}</Text>
                                                }
                                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                                        <Text style={{color:"#eb8634",fontSize:11,left:2}}>-----</Text>
                                                        <AntDesign name="right" color="#eb8634" style={{top:1}} />
                                                    </View>
                                            </View>
                                            <View style={{alignItems:"center"}}>
                                                <Text style={{color:"#000",fontSize:10}}>Reaching Time</Text>
                                                <Text style={{color:"#000",fontSize:14}}>{item.tripId.time.arr}</Text>
                                            </View>
                                        </View>
                                        {
                                            item.tripId.retime &&
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",marginTop:10}}>
                                                <View style={{alignItems:"center"}}>
                                                    <Text style={{color:"#000",fontSize:10}}>Reaching Time</Text>
                                                    <Text style={{color:"#000",fontSize:14}}>{item.tripId.retime.arr}</Text>
                                                </View>
                                                <View style={{alignItems:"center"}}>
                                                    <Text style={{textAlign:"center",color:"#000",fontSize:12}}>{JSON.stringify(item.tripId.returnDate).slice(0,JSON.stringify(item.tripId.returnDate).indexOf("T")).replace(/"/g,'')}</Text>
                                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                                        <AntDesign name="left" color="#eb8634" style={{top:1,left:2}} />
                                                        <Text style={{color:"#eb8634",fontSize:11,}}>-----</Text>
                                                    </View>
                                                </View>
                                                <View style={{alignItems:"center"}}>
                                                    <Text style={{color:"#000",fontSize:10}}>Reporting Time</Text>
                                                    <Text style={{color:"#000",fontSize:14}}>{item.tripId.retime.dept}</Text>
                                                </View>
                                            </View>
                                        }
                                        <View style={{alignItems:"center"}}>
                                            <View>
                                                <Text style={{color:"gray",fontWeight:"400"}}>Name: {item.u1_name}</Text>
                                                {
                                                    item.u2_name ? 
                                                    <Text style={{color:"gray",fontWeight:"400"}}>Name: {item.u2_name}</Text>
                                                    : null
                                                }
                                            </View>
                                        </View>
                                        <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-around",alignItems:"flex-end"}}>
                                            <Text style={{color:item.payment_status==="success"?"green":"#eb8634",fontSize:10,marginBottom:5}}>Payment {item.payment_status}</Text>
                                            {
                                                !item.seat_number2 ? <Text style={{color:"#eb8634",fontSize:20}}>{item.seat_number1}</Text> 
                                                :
                                                <Text style={{color:"#eb8634",fontSize:20}}>{item.seat_number1}, {item.seat_number2}</Text>
                                            }
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection:"row",
                                            alignItems:"center",
                                            justifyContent:"space-between",
                                            marginHorizontal:20,
                                            marginBottom:10
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor:secondary,
                                                paddingHorizontal:10,
                                                paddingVertical:5,
                                                borderRadius:4
                                            }}
                                            activeOpacity={0.6}
                                            onPress={()=>navigation.navigate("CancelTicket")}
                                        >
                                            <Text style={{color:"#fff"}}>Cancel Ticket</Text>
                                        </TouchableOpacity>
                                        {
                                            item.tripId.status == "success" ?
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor:primary,
                                                    paddingVertical:5,
                                                    paddingHorizontal:10,
                                                    borderRadius:4,
                                                }}
                                                onPress={()=>navigation.navigate("MapView",item.tripId.busId)}
                                            >
                                                <Text style={{color:"#fff"}}>Location</Text>
                                            </TouchableOpacity>
                                            :
                                            null
                                        }
                                    </View>
                                </View>
                                :
                                null
                            }
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default TicketScreen;

const styles = StyleSheet.create({
    screen:{
        flex:1,
        width:width
    },
    view:{
        backgroundColor: primary,
        borderBottomRightRadius:70,
        borderBottomLeftRadius:70,
        width:width,
        height:"25%",
    },
    view2:{
        // width:width,
        marginTop:-10,
        marginHorizontal:20
        // paddingHorizontal:30,
    },
    box:{
        backgroundColor:"white",
        elevation:5,
        borderRadius:10,
        paddingVertical:10,
        paddingHorizontal:10,
        marginTop:-20,
        width:"80%",
        marginBottom:10,
        justifyContent:"center",
    },
    button:{
        backgroundColor:secondary,
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:10,
        elevation:5,
        marginBottom:85
    },
    heading:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:10,
        paddingVertical:20,
        marginTop:40
    },
    btn:{
        padding:8,
        borderRadius:25,
        backgroundColor:newColor,
        marginLeft:10
    },
    btn1:{
        padding:20,
        borderRadius:50,
        backgroundColor:newColor,
        marginLeft:10
    },
    dot:{
        backgroundColor:fontColor,
        width:10,
        height:10,
        borderRadius:20,
        position:"absolute",
        right:3,
        top:3
    },
    notifications:{
        marginVertical:10,
        marginBottom:height/3.2,
    },
    notification:{
        flexDirection:"row",
        alignItems:"flex-start",
        borderBottomColor:"gray",
        borderBottomWidth:1,
        padding:10,
        width:width-60,
    }

})
