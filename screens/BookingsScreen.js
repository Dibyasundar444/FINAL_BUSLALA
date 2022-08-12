import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import React, {useState,useEffect} from 'react';
import { Dimensions,ScrollView, StyleSheet, Text, TouchableOpacity, View,Image } from 'react-native';
import { RalewayBold, RalewayRegular } from '../assets/fonts/fonts';
import { fontColor, newColor, primary, secondary } from '../components/Colors';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
// import ToggleSwitch from "toggle-switch-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config';


const {width, height} = Dimensions.get("window");

const BookingsScreen = ({route}) => {

    const { first_name, number, address } = route.params;

    const navigation = useNavigation()
    // const [defaultRating, setDefaultRating] = useState(2);
    // const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5])
    // const [on, setOn] = useState(false);
    // const [on1, setOn1] = useState(true);
    const [token, setToken] = useState("");
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());

    let tempDate = new Date(date);
    let year = tempDate.getFullYear();
    let month = ('0' + (tempDate.getMonth()+1)).slice(-2);
    let day = ('0' + tempDate.getDate()).slice(-2); 
    let fDate = `${year}-${month}-${day}`;


    // const starImgFilled = "https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png";
    // const starImgCorner = "https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png";

    const bookingAPI=async()=>{
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
                data.forEach(x=>setDate(x.createdAt));
            }else console.log(res.status);
        })
        .catch(e=>{
            console.log(e);
            alert("please try again later");
        })
    };
    useEffect(() => {
        bookingAPI();
    }, []);

    return (
        <View style={styles.screen}>
            <View style={styles.view}>
                <View style={styles.heading}>
                    <View style={{flexDirection:"row", alignItems:"center", marginTop:40}}>
                        <TouchableOpacity activeOpacity={0.8} style={{}}
                        onPress={()=>navigation.goBack()}>
                            <AntDesign
                            name="arrowleft"
                            size={24}
                            color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn1}>
                            <MaterialCommunityIcons
                            name="account-outline"
                            size={40}
                            color="white"
                            />
                        </TouchableOpacity>
                        <View style={{alignItems:"center", marginLeft:5}}>
                            <Text style={{fontSize:18, fontFamily:RalewayBold, color: "white"}}>{first_name}</Text>
                            <Text style={{fontSize:13, fontFamily:RalewayRegular, color: "white", marginVertical:5}}>+91 {number}</Text>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                {address == "" ? null :
                                <Entypo
                                    name="location-pin"
                                    color="white"
                                    size={24}
                                />
                                }
                                <Text style={{fontSize:13, fontFamily:RalewayRegular, color: "white"}}>{address}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.btn}
                            onPress={()=>navigation.navigate("Tickets")}
                            >
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
            </View>
            <View style={styles.view2}>
                <View style={{flexDirection:"row",elevation:5,alignItems:"center", width:"100%", backgroundColor:"white", justifyContent:"space-between", borderRadius:10, padding:10}}>
                    <TouchableOpacity 
                        style={{backgroundColor:"#fff",elevation:5,borderRadius:5,padding:2}}
                        onPress={()=>navigation.goBack()}
                    >
                        <AntDesign
                        name="arrowleft"
                        size={24}
                        color="black"
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily:RalewayBold, fontSize:17, color:"black"}}>My Bookings</Text>
                </View>
                <ScrollView style={styles.bookings} showsVerticalScrollIndicator={false}>
                    <View style={{alignItems:"center",left:-10}}>
                        {/* <View style={{flexDirection:"row", alignItems:"center", marginVertical:20, justifyContent:"center", width:"100%"}}>
                            <Text style={{fontSize:14, fontFamily:RalewayBold, color:"black"}}>Completed</Text>
                            <View style={{paddingHorizontal:10}}>
                                <ToggleSwitch
                                isOn={on}
                                onColor="red"
                                offColor="green"
                                size="small"
                                onToggle={()=>setOn(!on)}
                                />
                                <ToggleSwitch
                                isOn={on1}
                                onColor="red"
                                offColor="green"
                                size="small"
                                onToggle={()=>setOn1(!on1)}
                                />
                            </View>
                            <Text style={{fontSize:14, fontFamily:RalewayBold, color:"black"}}>Cancelled</Text>
                        </View> */}
                        {
                            // isData == true ? 
                            data.reverse().map((item,index)=>(
                                <View key={index}>
                                    <Text style={{color:"gray",textAlign:"center"}}>Payment {item.payment_status}</Text>
                                    <View style={styles.booking}>
                                        <View style={{alignItems:"center"}}>
                                            <View style={{height:50, width:50, borderRadius:25, backgroundColor:"#000"}}>
                                                <Image style={{overflow:"hidden",height:"100%",width:"100%",resizeMode:"contain"}} 
                                                    source={require("../assets/logo.png")}
                                                />
                                            </View>
                                            {/* <Text style={{fontSize:10, fontFamily:RalewayRegular, color:"gray", marginTop:3}}>3 mins ago</Text> */}
                                        </View>
                                        <View style={{alignItems:"flex-start", marginHorizontal:20}}>
                                            <Text style={{fontFamily:RalewayBold, fontSize:14, color:"black"}}>{item.tripId.busId.name}</Text>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <Text style={{fontSize:15, fontFamily:RalewayRegular, color:"gray"}}>{item.tripId.sourceId.name} </Text>
                                                <AntDesign
                                                name="swapright"
                                                color="black"
                                                size={24}
                                                />
                                                <Text style={{fontSize:15, fontFamily:RalewayRegular, color:"gray"}}>{item.tripId.destinationId.name}</Text>
                                            </View>
                                        </View>
                                        {/* <View style={{left:-10}}>
                                            <View style={{flexDirection:"row", alignItems:"center", marginTop:10}}>
                                                {maxRating.map((item, key)=>(
                                                <TouchableOpacity activeOpacity={0.8}
                                                key={item}
                                                onPress={()=>setDefaultRating(item)}
                                                >
                                                    <Image
                                                    source={
                                                        item <= defaultRating ? 
                                                        {
                                                        uri: starImgFilled
                                                        }
                                                        :{
                                                            uri: starImgCorner
                                                        }
                                                    }
                                                    style={{width:20, height:20, resizeMode:"contain"}}
                                                    />
                                                </TouchableOpacity>
                                                ))}
                                            </View>
                                            <Text style={{fontFamily:RalewayRegular, fontSize:10, color:"gray", marginTop:5}}>Thanks for your rating</Text>
                                        </View> */}
                                        <View style={{left:-15,marginTop:10,alignItems:"center"}}>
                                            <Text style={{color:"gray",fontSize:12,fontWeight:"bold"}}>Booking Date</Text>
                                            <Text style={{color:"gray",fontSize:12}}>{JSON.stringify(item.date).slice(0,JSON.stringify(item.date).indexOf("T")).replace(/"/g,'')}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                            // :
                            // <Text style={{color:"gray",textAlign:"center",fontWeight:"bold"}}>You have no booking yet</Text>
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default BookingsScreen

const styles = StyleSheet.create({
    screen:{
        flex:1,
        // backgroundColor: "white",
    },
    view:{
        backgroundColor: primary,
        borderBottomRightRadius:70,
        borderBottomLeftRadius:70,
        // width:"100%",
        height:"30%",
    },
    view2:{
        // width:"100%",
        marginTop:-10,
        paddingHorizontal:30
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
    heading:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:10,
        paddingVertical:20
    },
    btn:{
        padding:8,
        borderRadius:25,
        backgroundColor:newColor,
        marginLeft:5
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
    bookings:{
        marginVertical:10,
        width:width,
        marginBottom: height/2.9
    },
    booking:{
        flexDirection:"row",
        alignItems:"flex-start",
        borderBottomColor:"gray",
        borderBottomWidth:1,
        padding:10,
        // width:width,
    }

})
