import React, { Component } from 'react';
import { Text, View, Image, ScrollView, FlatList, StyleSheet, 
    Modal, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input  } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) =>
      dispatch(postComment(dishId, rating, author, comment)),
})

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({item, index}) => {
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
        <Card>
            <Card.Title>Comments</Card.Title>
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
        </Animatable.View>
    );
}

function RenderDish(props) {

    const dish = props.dish;
    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }

    const recognizeComment = ({ dx }) => {
        if (dx > 200) return true; // Left to right
        return false;
      };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState)){
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            } else if (recognizeComment(gestureState)) {
                props.openCommentForm();
            }
            return true;
        }
    })

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers} >
                <Card>
                    <Card.Title>{dish.name}</Card.Title>
                    <Card.Divider/>
                    {/* <Card.Image
                        source={{uri: 'https://mybootstrapweb.web.app/img/uthappizza.png'}} /> */}
                    {/* <Image
                        source={require('./images/uthappizza.png')}
                        style={{ width: '100%'}}
                        /> */}
                    <Image  style={styles.stretch}
                        source={{uri: baseUrl + dish.image}}/>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name="pencil"
                            type="font-awesome"
                            color="#512DA8"
                            onPress={() => props.openCommentForm()}
                        />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} 
                        />
                        </View>
                </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
    }

    defaultState() {
        return {
          rating: 3,
          author: "",
          comment: "",
          showCommentForm: false,
        };
      }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    resetCommentForm() {
        this.setState(this.defaultState());
    }

    handleComment(dishId) {
        this.setState({ showCommentForm: false });
        this.props.postComment(
          dishId,
          this.state.rating,
          this.state.author,
          this.state.comment
        );
        this.resetCommentForm();
      }
    
      openCommentForm() {
        this.setState({ showCommentForm: true });
      }
    
      setRating(rating) {
        this.setState({ rating });
      }
    
      setAuthor(author) {
        this.setState({ author });
      }
    
      setComment(comment) {
        this.setState({ comment });
      }

    render() {
        const dishId = this.props.route.params.dishId;
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    openCommentForm={() => this.openCommentForm()} />
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showCommentForm}
                    onDismiss={() => {
                        this.resetCommentForm();
                    }}
                    onRequestClose={() => this.resetCommentForm()}
                    >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}> Add your Comment </Text>
                        <Rating
                            minValue={1}
                            startingValue={3}
                            fractions={0}
                            showRating={true}
                            onFinishRating={(rating) => this.setRating(rating)}
                        />
                        <Input
                            placeholder="Author"
                            leftIcon={<Icon name="user" type="font-awesome" />}
                            onChangeText={(author) => this.setAuthor(author)}
                        />
                        <Input
                            placeholder="Comment"
                            leftIcon={<Icon name="comment" type="font-awesome" />}
                            onChangeText={(comment) => this.setComment(comment)}
                        />
                        <View>
                            <Button
                                title="Submit"
                                color="#512DA8"
                                onPress={() => {
                                    this.handleComment(dishId);
                                }}
                            />                            
                        </View>
                        <View style={{marginTop: 10}}>
                            <Button
                                title="Cancel"
                                color="#a9a9a9"
                                onPress={() => {
                                    this.resetCommentForm();
                                }}
                            />
                        </View>
                    </View>
                    </Modal>
                <RenderComments 
                    comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    stretch: {
      width: '100%',
      height: 200,
      resizeMode: 'cover'
    },
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
      modal: {
        justifyContent: "center",
        margin: 20,
      },
      modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        backgroundColor: "#512DA8",
        textAlign: "center",
        color: "white",
        marginBottom: 20,
      },
      modalText: {
        fontSize: 18,
        margin: 10,
      },
  });
  export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);