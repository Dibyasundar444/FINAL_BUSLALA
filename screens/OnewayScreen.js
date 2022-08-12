import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import React, { useEffect } from 'react';
import { BackHandler, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RalewayBold, RalewayRegular } from '../assets/fonts/fonts';
import { fontColor, newColor, primary, secondary, textColor } from '../components/Colors';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from "@react-navigation/native";
import { API, getUser } from '../config';



const OnewayScreen = () => {

    const colors = useTheme();


    const navigation = useNavigation();
    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [deptDate, setDeptDate] = useState("");
    const [deptDate2, setDeptDate2] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [click, setClick] = useState(false);
    const [from, setFrom] = useState("");
    const [to, setTo]= useState("");
    const [error, setError]= useState(false);
    const [error1, setError1]= useState(false);
    const [isOneWay, setIsOneWay] = useState(true);
    const [isTwoWay, setIsTwoWay] = useState(false);
    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [date3, setDate3] = useState(new Date());
    
    const [isClicked1, setIsClicked1] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);

    const [srcData, setSrcData] = useState([]);
    const [filteredSrcData, setFilteredSrcData] = useState([]);
    const [search, setSearch] = useState("");

    const [destData, setDestData] = useState([]);
    const [filteredDestData, setFilteredDestData] = useState([]);


    const handleConfirm1=(event,selectedDate)=>{    // ***must have to pass 'event' as a param whether it is used or not, otherwise gives error
        const currentDate = selectedDate || date1;      
        setDate1(currentDate);
        setIsVisible1(false);
        let tempDate = new Date(currentDate);
        let year = tempDate.getFullYear();
        let month = ('0' + (tempDate.getMonth()+1)).slice(-2);     // to get 0 before a single month (i.e 1 -> 01)
        let day = ('0' + tempDate.getDate()).slice(-2);             // to get 0 before a single day   (i.e 3 -> 03)
        let fDate = `${year}-${month}-${day}`;
        setDeptDate(fDate);
    };

    const handleConfirm2=(event,selectedDate)=>{    // ***must have to pass 'event' as a param whether it is used or not, otherwise gives error
        const currentDate = selectedDate || date2;      
        setDate2(currentDate);
        setIsVisible2(false);
        let tempDate = new Date(currentDate);
        let year = tempDate.getFullYear();
        let month = ('0' + (tempDate.getMonth() + 1)).slice(-2);     // to get 0 before a single month (i.e 1 -> 01)
        let day = ('0' + tempDate.getDate()).slice(-2);             // to get 0 before a single day   (i.e 3 -> 03)
        let fDate = `${year}-${month}-${day}`;
        setDeptDate2(fDate);
    };
    const handleConfirm3=(event,selectedDate)=>{    // ***must have to pass 'event' as a param whether it is used or not, otherwise gives error
        const currentDate = selectedDate || date3;      
        setDate3(currentDate);
        setIsVisible3(false);
        let tempDate = new Date(currentDate);
        let year = tempDate.getFullYear();
        let month = ('0' + (tempDate.getMonth() + 1)).slice(-2);     // to get 0 before a single month (i.e 1 -> 01)
        let day = ('0' + tempDate.getDate()).slice(-2);             // to get 0 before a single day   (i.e 3 -> 03)
        let fDate = `${year}-${month}-${day}`;
        setReturnDate(fDate);
    };

    const onewayHandler=()=>{
        setIsOneWay(true);
        setIsTwoWay(false);
    };

    const twowayHandler=()=>{
        setIsOneWay(false);
        setIsTwoWay(true);
    };

    var oneWayPostData = {
        "source": !click ? from : to, 
        "destination": !click ? to : from, 
        "date": deptDate
    };

    const busesHandler=()=>{
        if(from==="" || to===""){
            setError(true);
            setError1(true)
        }else if(deptDate ===""){
            alert("please provide valid date");
        }else{
            setError(false);
            setError1(false);
            axios.post(`${API}/searchOneWayBus`,oneWayPostData)
            .then((response)=>{
                if(response.status===200){
                    navigation.navigate("Buses",
                        {"Data": response.data, "src": !click ? from : to,"dest": !click ? to : from,
                        "oneWay": isOneWay,"date": deptDate
                    });
                }else{
                    console.log("Error");
                }
            }).catch((err)=>{
                alert("No bus found");
                console.log(err);
            });
        }
    };

    var roundTripPostData = {
        "source": !click ? from : to, 
        "destination": !click ? to : from, 
        "deptDate": "2022-06-20", 
        "returnDate": "2022-06-21"
    };

    const busesHandler1=()=>{
        if(from==="" || to===""){
            setError(true);
            setError1(true)
        }else if(deptDate2 > returnDate || deptDate2==="" || returnDate===""){
            alert("please provide valid date");
        }else{
            setError(false);
            setError1(false);
            axios.post(`${API}/roundTrip`,roundTripPostData)
            .then((response)=>{
                if(response.status===200){
                    navigation.navigate("Buses",
                        {"Data": response.data,"src": !click ? from : to,"dest": !click ? to : from,
                        "roundTrip": isTwoWay,"date": deptDate2,"rDate": returnDate
                    });
                }else{
                    console.log("Error");
                }
            }).catch((err)=>{
                alert("No bus found");
                console.log(err);
            });           
        }
    };
    const sourceApi=()=>{
        axios.get(`${API}/source`)
        .then(resp=>{
            // console.log(resp.data);
            const Data = resp.data;
            setSrcData(Data.data);
            setFilteredSrcData(Data.data);
        })
        .catch(e=>{console.log(e);alert("please try after some time")});
    };
    const destApi=()=>{
        axios.get(`${API}/destination`)
        .then(resp=>{
            if(resp.status===200){
                const Data = resp.data;
                setDestData(Data.data);
                setFilteredDestData(Data.data);
            }else console.log(resp.status);
        })
        .catch(e=>{
            console.log(e);
            alert("please try after some time");
        });
    };
    useEffect(() => {
        sourceApi();
        destApi();
        // funcBackHandler();
    }, []);

    const searchFilter=(text)=>{
        if(isClicked1){
            if(text){
                const newData =  srcData.filter((item)=>{
                    const itemData = item.name ? item.name.toUpperCase()
                    : ''.toUpperCase();
                    const textData  = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })
                setFilteredSrcData(newData);
                setSearch(text);
            }
            else{
                setFilteredSrcData(srcData);
                setSearch(text);
            }
        }
        else if(isClicked2){
            if(text){
                const newData =  destData.filter((item)=>{
                    const itemData = item.name ? item.name.toUpperCase()
                    : ''.toUpperCase();
                    const textData  = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                })
                setFilteredDestData(newData);
                setSearch(text);
            }
            else{
                setFilteredDestData(destData);
                setSearch(text);
            }
        }
    };

    const srcModal=()=>(
        isClicked1 && 
        <View style={styles.pickerModal}>
            <View style={{position:"absolute",right:0,marginRight:10,zIndex:1,top:20}}>
                <TouchableOpacity 
                    style={{backgroundColor:"gray",height:30,width:30,justifyContent:"center",alignItems:"center",borderRadius:15}}
                    onPress={()=>{
                        setIsClicked1(false);
                        setSearch("");
                        setFilteredSrcData(srcData);
                    }}
                >
                    <Text style={{color:"#000",fontSize:20,top:-2}}>×</Text>
                </TouchableOpacity>
            </View>
            <TextInput style={styles.searchField} 
                placeholder='search from ...'
                value={search}
                onChangeText={(val)=>searchFilter(val)}
            />
            <View style={{width:"100%",borderWidth:0.5,borderColor:"gray",marginTop:10}} />
            <ScrollView style={{}}>
            {
                !click ? 
                filteredSrcData.map((item,index)=>(
                    <View key={index} style={{marginLeft:40}}>
                        <TouchableOpacity style={styles.srcData}
                            onPress={()=>{
                                setFrom(item.name);
                                setIsClicked1(false);
                                setFilteredSrcData(srcData);
                                setSearch("");
                            }}
                        >
                            <Text style={{color:"#000",marginBottom:10}}>{item.name}</Text>
                        </TouchableOpacity>
                        <View style={{width:"80%",borderColor:"gray",borderWidth: 0.2}} />
                    </View>
                )) 
                :
                filteredDestData.map((item,index)=>(
                    <View key={index} style={{marginLeft:40}}>
                        <TouchableOpacity style={styles.srcData}
                            onPress={()=>{
                                setTo(item.name);
                                setIsClicked1(false);
                                setFilteredDestData(destData);
                                setSearch("");
                            }}
                        >
                            <Text style={{color:"#000",marginBottom:10}}>{item.name}</Text>
                        </TouchableOpacity>
                        <View style={{width:"80%",borderColor:"gray",borderWidth: 0.2}} />
                    </View>
                ))
            }
            </ScrollView>
        </View>
    );

    const destModal=()=>(
        isClicked2 && 
        <View style={styles.pickerModal}>
            <View style={{position:"absolute",right:0,marginRight:10,zIndex:1,top:20}}>
                <TouchableOpacity 
                style={{backgroundColor:"gray",height:30,width:30,justifyContent:"center",alignItems:"center",borderRadius:15}}
                onPress={()=>{
                    setIsClicked2(false);
                    setSearch("");
                    setFilteredDestData(destData);
                }}
                >
                    <Text style={{color:"#000",fontSize:20,top:-2}}>×</Text>
                </TouchableOpacity>
            </View>
            <TextInput style={styles.searchField} 
                placeholder='search to ...'
                value={search}
                onChangeText={(val)=>searchFilter(val)}
            />
            <View style={{width:"100%",borderWidth:0.5,borderColor:"gray",marginTop:10}} />
            <ScrollView style={{}}>
            {
                !click ?
                filteredDestData.map((item,index)=>(
                    <View key={index} style={{marginLeft:40}}>
                        <TouchableOpacity style={styles.srcData}
                            onPress={()=>{
                                setTo(item.name);
                                setIsClicked2(false);
                                setFilteredDestData(destData);
                                setSearch("");
                            }}
                        >
                            <Text style={{color:"#000",marginBottom:10}}>{item.name}</Text>
                        </TouchableOpacity>
                        <View style={{width:"80%",borderColor:"gray",borderWidth: 0.2}} />
                    </View>
                )) 
                :
                filteredSrcData.map((item,index)=>(
                    <View key={index} style={{marginLeft:40}}>
                        <TouchableOpacity style={styles.srcData}
                            onPress={()=>{
                                setFrom(item.name);
                                setIsClicked2(false);
                                setFilteredSrcData(srcData);
                                setSearch("");
                            }}
                        >
                            <Text style={{color:"#000",marginBottom:10}}>{item.name}</Text>
                        </TouchableOpacity>
                        <View style={{width:"80%",borderColor:"gray",borderWidth: 0.2}} />
                    </View>
                ))
            }
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={ isOneWay ? styles.view1 : styles.view}>
                    <View style={styles.heading}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.btn}
                        onPress={()=>navigation.navigate("Profile")}
                        >
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={30}
                                color="white"
                            />
                        </TouchableOpacity>
                        <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.btn}
                                onPress={()=>navigation.navigate("Tickets")}>
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
                    <View style={styles.text}>
                        <View style={styles.text1}>
                            <Text style={{fontSize:40, letterSpacing:2, fontFamily:RalewayRegular,color:fontColor}}>Where</Text>
                            <Text style={{fontSize:28, fontFamily:RalewayRegular,color:"white"}}> will</Text>
                        </View>
                        <View style={styles.text2}>
                            <Text style={{fontSize:28, fontFamily:RalewayRegular,color:"white"}}>you go</Text>
                            <Text style={{fontSize:40, letterSpacing:2,fontFamily:RalewayRegular,color:fontColor}}> Now?</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.view2}>
                    <View style={styles.container}>
                        <KeyboardAvoidingView behavior="padding" style={styles.box}>
                            <TouchableOpacity style={{alignItems:"center", flexDirection:"row",height:60}} 
                                onPress={()=>setIsClicked1(true)}
                            >
                                <Entypo
                                name="location-pin"
                                color="black"
                                size={24}
                                />
                            <Text style={{color:"#000",fontSize:16,marginLeft:20}}>{!click ? (!from ? `From` : from) : (!to ? `From` : to)}</Text>
                            </TouchableOpacity>
                            {error ? <Text style={{color:"red", fontSize:12}}>Please Enter The Details</Text>: <Text></Text>}
                        </KeyboardAvoidingView>
                        <TouchableOpacity activeOpacity={0.8} 
                        onPress={()=>setClick(!click)}
                        style={{backgroundColor:secondary, padding:5, borderRadius:20, marginBottom:25, alignSelf:"flex-end", marginRight:"20%"}}>
                            <MaterialCommunityIcons
                                name="compare-vertical"
                                size={24}
                                color="white"
                                />
                        </TouchableOpacity>
                        <KeyboardAvoidingView behavior="padding" style={styles.box}>
                            <TouchableOpacity style={{alignItems:"center", flexDirection:"row",height:60}} 
                                onPress={()=>setIsClicked2(true)}
                            >
                                <Ionicons
                                name="locate"
                                size={24}
                                color="black"
                                />
                            <Text style={{color:"#000",fontSize:16,marginLeft:20}}>{!click ? (!to ? `To` : to) : (!from ? `To` : from) }</Text>
                            </TouchableOpacity>
                            {error1 ? <Text style={{color:"red", fontSize:12}}>Please Enter The Details</Text>:<Text></Text>}
                        </KeyboardAvoidingView>
                        <View style={styles.tab}>
                            <TouchableOpacity
                            onPress={onewayHandler}
                            activeOpacity={0.8} style={isOneWay ? styles.isOneWayActive : styles.isOneWayOff}>
                                <Text style={isOneWay ? styles.textActive : styles.textOff}>Oneway</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            onPress={twowayHandler}
                            activeOpacity={0.8} style={!isTwoWay ? styles.isOneWayOff : styles.isOneWayActive}>
                                <Text style={!isTwoWay ? styles.textOff : styles.textActive}>RoundTrip</Text>
                            </TouchableOpacity>
                        </View>
                        {isOneWay && <View style={styles.date}>
                            <Text style={{color:"black", fontFamily:RalewayBold, fontSize:16, marginBottom:4}}>Departure Date</Text>
                            <TouchableOpacity activeOpacity={0.8}
                            onPress={()=>setIsVisible1(true)}
                            style={{paddingBottom: 3,alignItems:"center", justifyContent:"space-between", flexDirection:"row", borderBottomColor:colors.colors.text, borderBottomWidth:1}}>
                                {(deptDate==="") ? <Text style={{fontSize:15, color:"gray", padding:5}}>YYYY-MM-DD</Text>
                                : <Text style={{fontSize:15, color:"gray", padding:5}}>{deptDate}</Text>}
                                {isVisible1 && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    mode={"date"}
                                    display="calendar"
                                    value={date1}
                                    minimumDate={new Date()}
                                    onTouchCancel={()=>setIsVisible1(false)}
                                    onChange={handleConfirm1}
                                />)
                                }
                            </TouchableOpacity>
                        </View>}
                        { isTwoWay && <View style={styles.dates}>
                            <View style={styles.date}>
                                <Text style={{color:"black", fontFamily:RalewayBold, fontSize:16, marginBottom:4}}>Departure Date</Text>
                                <TouchableOpacity activeOpacity={0.8}
                                onPress={()=>setIsVisible2(true)}
                                style={{paddingBottom: 3,alignItems:"center", justifyContent:"space-between", flexDirection:"row",borderBottomColor:colors.colors.text, borderBottomWidth:1}}>
                                    {(deptDate2==="") ? <Text style={{fontSize:15, color:"gray", padding:5}}>YYYY-MM-DD</Text>
                                    : <Text style={{fontSize:15, color:"gray", padding:5}}>{deptDate2}</Text>}
                                    {isVisible2 && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            mode={"date"}
                                            display="calendar"
                                            value={date2}
                                            minimumDate={new Date()}
                                            onTouchCancel={()=>setIsVisible2(false)}
                                            onChange={handleConfirm2}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.date}>
                                <Text style={{color:"black", fontFamily:RalewayBold, fontSize:16, marginBottom:4}}>Return Date</Text>
                                <TouchableOpacity activeOpacity={0.8}
                                onPress={()=>setIsVisible3(true)}
                                style={{paddingBottom: 3,alignItems:"center", justifyContent:"space-between", flexDirection:"row", borderBottomColor:colors.colors.text, borderBottomWidth:1}}>
                                    {(returnDate==="") ? <Text style={{fontSize:15, color:"gray", padding:5}}>YYYY-MM-DD</Text>
                                    : <Text style={{fontSize:15, color:"gray", padding:5}}>{returnDate}</Text>}
                                    {isVisible3 && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            mode={"date"}
                                            display="calendar"
                                            value={date3}
                                            minimumDate={new Date()}
                                            onTouchCancel={()=>setIsVisible3(false)}
                                            onChange={handleConfirm3}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>}
                        <TouchableOpacity  activeOpacity={0.8} style={styles.button}
                        onPress={isOneWay ? busesHandler : busesHandler1}>
                            <Text style={{color:"white",fontSize:18, fontFamily:RalewayBold}}>Find Buses</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {srcModal()}
            {destModal()}
        </View>
    )
}

export default OnewayScreen;

const styles = StyleSheet.create({
    screen:{
        flex:1,
        // backgroundColor: "white",
    },
    view:{
        backgroundColor: primary,
        borderBottomRightRadius:100,
        borderBottomLeftRadius:100,
        width:"100%",
        height:"40%",
    },
    view1:{
        backgroundColor: primary,
        borderBottomRightRadius:100,
        borderBottomLeftRadius:100,
        width:"100%",
        height:"45%",
    },
    view2:{
        width:"100%"
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
    input:{
        backgroundColor:"lightgray",
        borderRadius:10,
        width:"80%",
        marginVertical:20
    },
    button:{
        backgroundColor:secondary,
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:10,
        elevation:5,
        marginBottom:100
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
    container:{
        width:"100%",
        alignItems:"center"
    },
    text:{
        alignItems:"center",
        marginTop:30,
        marginRight: 50
    },
    text1:{
        flexDirection:"row",
        alignItems:"flex-end",
        marginBottom:1
    },
    text2:{
        flexDirection:"row",
        alignItems:"flex-end",
        marginBottom:5,
        marginLeft:100,
    },
    tab:{
        flexDirection:"row",
        alignItems:"center",
        marginVertical:10
    },
    date:{
        alignSelf:"flex-start",
        paddingHorizontal:50,
        marginVertical:10,
        width:"100%"
    },
    isOneWayActive:{
        backgroundColor: primary,
        paddingHorizontal:15, 
        paddingVertical:10,
        borderRadius:10
    },
    isOneWayOff:{
        backgroundColor: "white",
        paddingHorizontal:15, 
        paddingVertical:10,
        borderRadius:10
    },
    textActive:{
        color: "white",
        fontSize:15,
        fontFamily: RalewayBold
    },
    textOff:{
        color: "black",
        fontSize:15,
        fontFamily: RalewayBold
    },
    pickerModal: {
        position:"absolute",
        backgroundColor:"#fff",
        left:20,
        right:20,
        top:20,
        bottom:20,
    },
    srcData: {
        marginTop: 10,
    },
    searchField: {
        backgroundColor:"gray",
        marginRight:60,
        marginTop:10,
        marginLeft:10,
        borderRadius:30,
        paddingLeft:30
    }
})
