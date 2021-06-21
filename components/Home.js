import React, { Component } from 'react'

import {View,StyleSheet,FlatList,Text, Alert, ScrollView,TouchableWithoutFeedback, Keyboard, TouchableOpacity} from 'react-native'
import { Appbar,TextInput,Button,List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';

export default class Home extends Component{
    key = 1;
    todo = []
    state={
        text:'',
        item:[
            {key:this.key,data:''}
        ]
    }

    storeDate = async() =>{
        if(this.state.text.length < 3){
            Alert.alert('your tods must be more then 3 charecter')
        }else{

            try{
                this.todo.push({key:this.key,data:this.state.text})
                this.setState({text:''})
                await AsyncStorage.setItem('myItem',JSON.stringify(this.todo))

                // await AsyncStorage.setItem('key',JSON.stringify(this.key))
                this.key++;
                let value = await AsyncStorage.getItem('myItem');
                this.setState({item:JSON.parse(await AsyncStorage.getItem('myItem'))})
                console.log(this.state.item);
             }catch(err){
                 console.log(err)
             }
             Keyboard.dismiss();
        }
    }

    async componentDidMount (){
        this.todo = JSON.parse(await AsyncStorage.getItem('myItem'))
        this.todo.push({key:'xfcd',data:'xfcd'})
        await AsyncStorage.setItem('myItem',JSON.stringify(this.todo));
        console.log(await AsyncStorage.getItem('myItem'))
        const val = await AsyncStorage.getItem('myItem')
        if(val.length > 0){         
            this.key = this.state.item[this.state.item.length-1].key+1;
            this.todo = this.todo.filter(item=>item.data!='xfcd')
            await AsyncStorage.setItem('myItem',JSON.stringify(this.todo))
            console.log(await AsyncStorage.getItem('myItem'))
            this.setState({item:JSON.parse(await AsyncStorage.getItem('myItem'))})
            // console.log(this.state.item[this.state.item.length-1].key+1);
        }else{
            
            console.log('test')
        }
    }

     async deleteTodo (key){
         console.log('come to delete')
        try{
            this.todo = this.state.item.filter(item=>item.key!=key)
            await AsyncStorage.setItem('myItem',JSON.stringify(this.todo))
            let value = await AsyncStorage.getItem('myItem');
            this.setState({item:JSON.parse(await AsyncStorage.getItem('myItem'))})
        }catch(err){
            console.log(err)
        }
    }

    render(){
        return(
            <View >
                <Appbar.Header>
                    <Appbar.Content title="YOUR TODO'S"   style={{paddingLeft:24}}/> 
                </Appbar.Header>

                    <View style={{padding:24}}>
                        <TextInput
                            label="add todo item"
                            value={this.state.text}
                            onChangeText={text => this.setState({text})}
                        />
                        <Button  mode="contained" onPress={this.storeDate} style={{marginTop:10,borderRadius:20,padding:3}}>
                        ADD TODO
                        </Button>

                        <FlatList
                            data={this.state.item}
                            renderItem={({ item }) => (
                            //    <Text>{item.data}</Text>
                                <List.Item
                                title={item.data}
                                 right={() => (
                                     <TouchableOpacity onPress={()=>this.deleteTodo(item.key)}>
                                         <Icon name="delete" size={24} color="#333" style={{marginRight:5}} />
                                     </TouchableOpacity>
                                 )}
                                style={{backgroundColor:'#d3d3d3',borderRadius:20,margin:10}}
                                />
                            )}
                        />
                        
                    </View>
            </View>
        )
    }
}