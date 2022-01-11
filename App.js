import React,{useState,useEffect} from 'react';
import { Text, View,TextInput,StyleSheet, Alert,FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Drawer = createDrawerNavigator();
const Stack=createStackNavigator();

//global array
const storage=[];
const Home=()=>{
  return(
      <View>
          <Text>Welcome to Car Management App</Text>
          <Text>Please click the hamburger icon at the top to manage cars or car brands</Text>
      </View>
  )
}

const createCar=()=>{
  const [url,setUrl]=useState("");
  const [maker,setMaker]=useState("");
  const [model,setModel]=useState("");
  const [year,setYear]=useState("");
  const [color,setColor]=useState("");
  const [power,setPower]=useState("");

   //array to store each car entry as an object.

  const saveCar=async()=>{
    const id=Math.floor(Math.random()*100);
    const car={
      id:id,
      url:url,
      maker:maker,
      model:model,
      year:year,
      color:color,
      power:power
    }
    storage.push(car);
    try {
      await AsyncStorage.setItem(`${id}`,JSON.stringify(car));
      // //clear all async storage
      // await AsyncStorage.clear();
      Alert.alert("Car Saved");
      
    } catch (error) {
      console.log(error);
      
    }
    console.log(storage);
    // reset state after saving
    setUrl("");
    setMaker("");
    setModel("");
    setYear("");
    setColor("");
    setPower("");
  }
  
  return(
      <View style={styles.formContainer}>
          <View >
            <TextInput onChangeText={ (url)=>{setUrl(url)} } style={styles.formInput} placeholder='photo url'></TextInput>
            <TextInput onChangeText={ (maker)=>{setMaker(maker)} } style={styles.formInput} placeholder='maker e.g toyota etc'></TextInput>
            <TextInput onChangeText={ (model)=>{setModel(model)} } style={styles.formInput} placeholder='model e.g Corolla,GLI'></TextInput>
            <TextInput onChangeText={ (year)=>{setYear(year)} } style={styles.formInput}placeholder='Manufaturing Year e.g 2001'></TextInput>
            <TextInput onChangeText={ (power)=>{setPower(power)} } style={styles.formInput} placeholder='Engine Power e.g 1600 CC'></TextInput>
            <TextInput onChangeText={ (color)=>{setColor(color)} } style={styles.formInput} placeholder='color e.g black, green etc.'></TextInput>
            <TouchableOpacity onPress={()=>{saveCar()}}>
              <Text style={styles.formButton}>Create Car</Text>
            </TouchableOpacity>
          </View>
      </View>
  )
}

const carList=({navigation})=>{
  //business logic to fetch all car lists
  //get all keys from async storage
  const [carList,setCarList]=useState([]);
  useEffect(()=>{
    const getAllKeys=async()=>{
      try {
        const keys=await AsyncStorage.getAllKeys();
        const carList=[];
        for(let i=0;i<keys.length;i++){
          const car=await AsyncStorage.getItem(keys[i]);
          carList.push(JSON.parse(car));
        }
        setCarList(carList);
      } catch (error) {
        console.log(error);
      }
    }
    getAllKeys();
  },[])
  //render carList inside a flatlist
  return(
      <View>
          <Text>Car List</Text>
          <FlatList
          data={carList}
          renderItem={({item})=>{
            return(
              <View style={styles.listItem}>
                <TouchableOpacity onPress={ ()=>{navigation.push("CarDetails",{car:item}) }}>
                <Text>{item.maker}</Text>
                <Text>{item.model}</Text>
                <Text>{item.year}</Text>
                <Text>{item.color}</Text>
                <Text>{item.power}</Text>
                </TouchableOpacity>
              </View>
            )
          }
          }
          keyExtractor={(item)=>{
            return item.id.toString();
          }
          }
          />
      </View>
  )
}

//car details screen.
const CarDetails=({route})=>{
  const car=route.params.car;
  return(
      <View>
          <Text>Car Details</Text>
          <Text>Maker: {car.maker}</Text>
          <Text>Model: {car.model}</Text>
          <Text>Year of Manufaturing{car.year}</Text>
          <Text>Color :{car.color}</Text>
          <Text>Engine Power{car.power}</Text>
      </View>
  )
}

const ManageCars=({navigation})=>{
    return(
      <Stack.Navigator initialRouteName='carList'>
      <Stack.Screen name="carList" component={carList} options={{headerTitle:"All Cars",headerRight:()=><AntDesign name="plus" size={24} color="black" style={{padding:10}} onPress={ ()=>{navigation.navigate("createCar")} } /> }}/>
      <Stack.Screen name="createCar" component={createCar} options={{headerTitle:"Create Car"}}/>
      <Stack.Screen name="CarDetails" component={CarDetails} options={{headerTitle:"Car Details"}}/>
      </Stack.Navigator>
    )
}

const ManageCarBrands=()=>{
  return(
      <View>
          <Text>ManagerCarBrands</Text>
      </View>
  )
}
const App=()=>{
return (
<NavigationContainer>
<Drawer.Navigator initialRouteName="Home">
<Drawer.Screen name="Home" component={Home}/>
<Drawer.Screen name="ManageCars" component={ManageCars}/>
<Drawer.Screen name="ManagaeCarBrands" component={ManageCarBrands}/>
</Drawer.Navigator>
</NavigationContainer>
);
}

const styles=StyleSheet.create({
  formContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  formInput:{
    width:300,
    height:50,
    borderColor:'black',
    borderWidth:1,
    margin:10,
    padding:10
  },
  formButton:{
    width:300,
    height:50,
    borderColor:'black',
    borderWidth:1,
    margin:10,
    padding:10,
    backgroundColor:'#00bfff',
    color:'white',
    fontSize:20,
    textAlign:'center'
  },
  carList:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  listItem:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#00bfff',
    color:'white',
    fontSize:20,
    margin:10,

  }

})

export default App;