import React, { Component } from 'react';
import { View, Platform, Text, ScrollView, Image, StyleSheet, SafeAreaView, ToastAndroid } from 'react-native';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NetInfo from "@react-native-community/netinfo";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';
import AboutUs from './AboutComponent';
import Menu from './MenuComponent';
import ContactUs from './ContactComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Reservation from './ReservationComponent';
import Favorites from './FavoriteComponent';
import Login from './LoginComponent';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
})

{/** USE OF CURRENT VERSION OF REACT NATIVE

Adoption of hints from https://reactnavigation.org/docs/stack-navigator/,
 https://reactnavigation.org/docs/drawer-based-navigation and 
 https://www.coursera.org/learn/react-native/discussions/weeks/1/threads/8PifLG4EQ724nyxuBDO9DQ

npm install @react-navigation/native
expo install react-native-gesture-handler react-native-reanimated react-native-screens
    react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack
npm install @react-native-community/masked-view
npm install react-native-safe-area-context
*/}

{/** Navigation Part 1 - Menu and Dishdetail */}

const StackNavigatorIcon = ({ navigation }) => {
    return (
        <Icon
            iconStyle={{ padding: 15 }}
            name='menu'
            size={24}
            color='white'
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
    )
}

const DrawerNavigatorIcon = ({ name, size }) => {
    return (
        <Icon
            name={name}
            type='font-awesome'
            size={size ? size : 24}
        />
    )
}

const MenuNavigator = createStackNavigator();

function MenuNavigatorScreen({ navigation }) {
    return(
        <MenuNavigator.Navigator
            initialRouteName='Menu'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <MenuNavigator.Screen
                name="Menu"
                component={Menu}
                options={{
                    headerLeft: () => <StackNavigatorIcon navigation={navigation} />
                }}
            />
            <MenuNavigator.Screen
                name="Dishdetail"
                component={Dishdetail}
                options={{ headerTitle: "Dish Detail"}}
            />            
        </MenuNavigator.Navigator>
    );
}

{/** Navigation Part 2 - Home and Drawer Navigation */}

const HomeNavigator = createStackNavigator();

function HomeNavigatorScreen({ navigation }) {
  return(
      <HomeNavigator.Navigator
          initialRouteName='Home'
          screenOptions={{
              headerStyle: {
                  backgroundColor: "#512DA8"
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                  color: "#fff"            
              }
          }}
      >
          <HomeNavigator.Screen
              name="Home"
              component={Home}
              options={{
                headerLeft: () => <StackNavigatorIcon navigation={navigation} />
            }}
          />         
      </HomeNavigator.Navigator>
  );
}

const ContactNavigator = createStackNavigator();
function ContactNavigatorScreen({navigation}){
    return(
        <ContactNavigator.Navigator
          initialRouteName='Contact'
          screenOptions={{
              headerStyle: {
                  backgroundColor: "#512DA8"
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                  color: "#fff"            
              }
          }}
        >
            <ContactNavigator.Screen 
                name="Contact"
                component={ContactUs}
                options={{
                    headerLeft: () => <StackNavigatorIcon navigation={navigation} />
                }}
            />
        </ContactNavigator.Navigator>
    )
}
const AboutNavigator = createStackNavigator();
function AboutNavigatorScreen({navigation}){
    return (
        <AboutNavigator.Navigator
        initialRouteName='About'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#512DA8"
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                color: "#fff"            
            }
        }}
        >
            <AboutNavigator.Screen
                name="About"
                component={AboutUs}
                options={{
                    headerLeft: () => <StackNavigatorIcon navigation={navigation} />
                }}
            />
        </AboutNavigator.Navigator>
    )
}
const ReservationNavigator = createStackNavigator();
function ReservationNavigatorScreen({navigation}){
  return (
    <ReservationNavigator.Navigator
      initialRouteName='Reserve Table'
          screenOptions={{
              headerStyle: {
                  backgroundColor: "#512DA8"
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                  color: "#fff"            
              }
          }}
        >
        <ReservationNavigator.Screen
          name="Reserve Table"
          component={Reservation}
          options={{
              headerLeft: () => <StackNavigatorIcon navigation={navigation} />
          }}
        />
    </ReservationNavigator.Navigator>
  )
}

const FavoriteNavigator = createStackNavigator();
function FavoriteNavigatorScreen({navigation}){
  return (
    <FavoriteNavigator.Navigator
      initialRouteName='Favorites'
          screenOptions={{
              headerStyle: {
                  backgroundColor: "#512DA8"
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                  color: "#fff"            
              }
          }}
        >
        <FavoriteNavigator.Screen
          name="Favorites"
          component={Favorites}
          options={{
              headerLeft: () => <StackNavigatorIcon navigation={navigation} />
          }}
        />
    </FavoriteNavigator.Navigator>
  )
}

const LoginNavigator = createStackNavigator();
function LoginNavigatorScreen({navigation}){
  return (
    <LoginNavigator.Navigator
      initialRouteName='Login'
          screenOptions={{
              headerStyle: {
                  backgroundColor: "#512DA8"
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                  color: "#fff"            
              }
          }}
        >
        <LoginNavigator.Screen
          name="Login"
          component={Login}
          options={{
              headerLeft: () => <StackNavigatorIcon navigation={navigation} />
          }}
        />
    </LoginNavigator.Navigator>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    drawerHeader: {
      backgroundColor: '#512DA8',
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row'
    },
    drawerHeaderText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold'
    },
    drawerImage: {
      margin: 10,
      width: 80,
      height: 60
    }
})

const CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} 
      forceInset={{ top: 'always', horizontal: 'never' }}>
      <View style={styles.drawerHeader}>
        <View style={{flex:1}}>
        <Image source={require('./images/logo.png')} style={styles.drawerImage} />
        </View>
        <View style={{flex: 1.75}}>
          <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </SafeAreaView>
  </ScrollView>
);

const Drawer = createDrawerNavigator();

function MainNavigator({ navigation }) {
    return(
        <Drawer.Navigator initialRouteName="Home" drawerStyle={{ backgroundColor: "#D1C4E9" }}
        drawerContent={props => <CustomDrawerContentComponent {...props} />} >
          <Drawer.Screen name="Login" component={LoginNavigatorScreen} drawerLabel='Login'
            options={{
                drawerIcon: () => <DrawerNavigatorIcon name='sign-in' size={22} />
            }}
          />
          <Drawer.Screen name="Home" component={HomeNavigatorScreen} 
            drawerLabel='Home'
            options={{
                drawerIcon: () => <DrawerNavigatorIcon name='home' />
            }}
          />
          <Drawer.Screen name="About"  component={AboutNavigatorScreen}
            drawerLabel='About Us'
            options={{
                drawerIcon: () => <DrawerNavigatorIcon name='info-circle' />
            }}
          />
          <Drawer.Screen name="Menu" component={MenuNavigatorScreen} drawerLabel='Menu'
            options={{
                drawerIcon: () => <DrawerNavigatorIcon name='list' />
            }}
          />
          <Drawer.Screen name="Contact" component={ContactNavigatorScreen} drawerLabel='Contact'
            options={{
                drawerIcon: () => <DrawerNavigatorIcon name='address-card' size={22} />
            }}
          />
          <Drawer.Screen name="Favorites" component={FavoriteNavigatorScreen} drawerLabel='Favorites'
            options={{
                drawerIcon: () => <DrawerNavigatorIcon name='heart' size={22} />
            }}
          />
          <Drawer.Screen name="Reserve Table" component={ReservationNavigatorScreen} drawerLabel='Reserve Table'
            options={{
                drawerIcon: () => <DrawerNavigatorIcon name='cutlery' size={22} />
            }}
          />
        </Drawer.Navigator>
    );
}
  
class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
        type: null,
        isConnected: null
    }
  }
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();

    //Setting initial network state
    NetInfo.fetch().then((connectionInfo) => {
        ToastAndroid.show('Initial Network Connectivity Type: '
            + connectionInfo.type, ToastAndroid.LONG);
        this.setState({type: connectionInfo.type});
    });
    //Subscribing to network updates
    this.netinfoUnsubscribe = NetInfo.addEventListener(this.handleConnectivityChange); 
  }

  componentWillUnmount() {
    if (this.netinfoUnsubscribe) {
      this.netinfoUnsubscribe();
      this.netinfoUnsubscribe = null;
    }
  }

  handleConnectivityChange = (connectionInfo) => {
    if(connectionInfo.type !== this.state.type){
      this.setState({type : connectionInfo.type});
      this.setState({isConnected : connectionInfo.isConnected});
      switch (this.state.type) {
          case 'none':
              ToastAndroid.show('You are now offline!', ToastAndroid.LONG);
              break;
          case 'wifi':
              ToastAndroid.show('You are now connected to WiFi!', ToastAndroid.LONG);
              break;
          case 'cellular':
              ToastAndroid.show('You are now connected to Cellular!', ToastAndroid.LONG);
              break;
          case 'unknown':
              ToastAndroid.show('You now have unknown connection!', ToastAndroid.LONG);
              break;
          default:
              break;
      }
    }
    else{
        null;
    }
  }

  render() {
    return (
      <NavigationContainer>   
        <MainNavigator />
      </NavigationContainer>
    );
  }
}


{/** SIMPLE EXAMPLE from https://reactnavigation.org/docs/drawer-based-navigation

function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={() => navigation.navigate('Notifications')}
          title="Go to notifications"
        />
      </View>
    );
  }
  
  function NotificationsScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
  }

class Main extends Component {

  render() {
 
    return (
        <NavigationContainer>    
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Notifications" component={NotificationsScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
    );
  }
}
*/};

  
export default connect(mapStateToProps, mapDispatchToProps)(Main);