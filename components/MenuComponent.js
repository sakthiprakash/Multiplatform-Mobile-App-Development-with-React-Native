import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { ListItem, Avatar, Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    return {
        dishes: state.dishes
    }
}

class Menu extends Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: 'Menu'
    };

    render() {
        const { navigate } = this.props.navigation;
        const renderMenuItem = ({item, index}) => {
            return (
                    // <ListItem
                    //     key={index}
                    //     hideChevron={true}
                    //     onPress={() => navigate('Dishdetail', { dishId: item.id })}
                    // >
                    //     {/* <Avatar rounded 
                    //     source={{uri: 'https://mybootstrapweb.web.app/img/uthappizza.png'}} /> */}
                    //     <Image style={{width: 50, height: 50, borderRadius: 25}} 
                    //     source={require('./images/uthappizza.png')}/>
                    //     {/* <Avatar rounded source={require('./images/vadonut.png')}></Avatar> */}
                    //     <ListItem.Content>
                    //         <ListItem.Title>{item.name}</ListItem.Title>
                    //         <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                    //     </ListItem.Content>
                    // </ListItem>
                    <Animatable.View animation="fadeInRightBig" duration={2000}>
                    <Tile
                        key={index}
                        title={item.name}
                        caption={item.description}
                        featured
                        onPress={() => navigate('Dishdetail', { dishId: item.id })}
                        imageSrc={{ uri: baseUrl + item.image}}
                        />
                    </Animatable.View>
            );
        };

        // return (
        //         <FlatList 
        //             data={this.props.dishes.dishes}
        //             renderItem={renderMenuItem}
        //             keyExtractor={item => item.id.toString()}
        //             />
        // );
        if (this.props.dishes.isLoading) {
            return(
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
            return(
                <View>            
                    <Text>{props.dishes.errMess}</Text>
                </View>            
            );
        }
        else {
            return (
                <FlatList 
                    data={this.props.dishes.dishes}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                    />
            );
        }
    }
}


export default connect(mapStateToProps)(Menu);