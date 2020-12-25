import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Switch,
  Button,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import { Icon } from "react-native-elements";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import Moment from "moment";
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      smoking: false,
      date: new Date(),
      show: false,
      mode: "date"
    };
  }

  static navigationOptions = {
    title: 'Reserve Table',
  };

  resetForm() {
    this.setState({
        guests: 1,
        smoking: false,
        date: new Date()
    });
  }

  confirmReservation() {
    // Stub for future code
    this.resetForm();
  }

  handleReservation() {
    const { date, guests, smoking } = this.state;

    Alert.alert(
      'Your Reservation OK?',
      `Number of guests: ${guests}\nSmoking? ${smoking ? 'Yes' : 'No'}\nDate and Time:${" " + Moment(this.state.date).format("DD-MM-YYYY h:mm A")}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => this.resetForm(),
        },
        {
          text: 'OK',
          // eslint-disable-next-line no-confusing-arrow, no-console
          onPress: () => {
            this.presentLocalNotification(this.state.date);
            this.addReservationToCalendar(this.state.date);
            this.confirmReservation();
          },
        },
      ],
      { cancelable: false },
    );
  }

  async obtainCalendarPermission() {
    let permission = await Permissions.getAsync(Permissions.CALENDAR);
    if (permission.status !== 'granted') {
        permission = await Permissions.askAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            Alert.alert('Permission not granted to access the calendar');
        }
    }
    return permission;
}

async addReservationToCalendar(date) {
    await this.obtainCalendarPermission();
    let dateMs = Date.parse(date);
    let startDate = new Date(dateMs);
    let endDate = new Date(dateMs + 2 * 60 * 60 * 1000);
    const defaultCalendarSource = Platform.OS === 'ios' ? await getDefaultCalendarSource() 
    : { isLocalAccount: true, name: 'Expo Calendar' };
    let details = {
        title: 'Con Fusion Table Reservation',
        source: defaultCalendarSource,
        name: 'internalCalendarName',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
    }

    const calendarId = await Calendar.createCalendarAsync(details);

    await Calendar.createEventAsync(calendarId , {
        title: 'Con Fusion Table Reservation',
        startDate: startDate,
        endDate: endDate,
        timeZone: 'Asia/Hong_Kong',
        location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
    });

}

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
    if (permission.status !== 'granted') {
        permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            Alert.alert('Permission not granted to show notifications');
        }
    }
    return permission;
  }

  async requestPermissionsAsync() {
    return await Notifications.requestPermissionsAsync({
      android: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  }

  async presentLocalNotification(date) {
      await this.obtainNotificationPermission();
      await this.requestPermissionsAsync();
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Your Reservation',
          body: 'Reservation for '+ Moment(date).format('DD-MM-YYYY h:mm A') + ' requested',
          sound: true,
          vibrate: true
        },
        trigger: { seconds: 5 }
      });
  }

  render() {
    return (
      <Animatable.View animation="zoomIn" duration={2000}>
      <ScrollView>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Number of Guests</Text>
          <Picker
            style={styles.formItem}
            selectedValue={this.state.guests}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ guests: itemValue })
            }
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
          </Picker>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
          <Switch
            style={styles.formItem}
            value={this.state.smoking}
            onTintColor="#512DA8"
            onValueChange={(value) => this.setState({ smoking: value })}
          ></Switch>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Date and Time</Text>
          <TouchableOpacity
            style={styles.formItem}
            style={{
              padding: 7,
              borderColor: "#512DA8",
              borderWidth: 2,
              flexDirection: "row",
            }}
            onPress={() => this.setState({ show: true, mode: "date" })}
          >
            <Icon type="font-awesome" name="calendar" color="#512DA8" />
            <Text>
              {" " + Moment(this.state.date).format("DD-MM-YYYY h:mm A")}
            </Text>
          </TouchableOpacity>

          {this.state.show && (
            <DateTimePicker
              value={this.state.date}
              mode={this.state.mode}
              minimumDate={new Date()}
              minuteInterval={30}
              onChange={(event, date) => {
                if (date === undefined) {
                  this.setState({ show: false });
                } else {
                  this.setState({
                    show: this.state.mode === "time" ? false : true,
                    mode: "time",
                    date: new Date(date),
                  });
                }
              }}
            />
          )}
        </View>

        <View style={styles.formButton}>
          <Button
            onPress={() => this.handleReservation()}
            title="Reserve"
            color="#512DA8"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </ScrollView>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },

  formLabel: {
    fontSize: 18,
    flex: 2,
  },

  formItem: {
    flex: 1,
  },

  formButton: {
    flex: 1,
    margin: 20
  }
});

export default Reservation;
