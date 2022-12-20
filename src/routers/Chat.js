import moment from 'moment';
import React, {useMemo, useReducer, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import uuid from 'react-native-uuid';

const TYPES = {
  USER: 'user',
  ADMIN: 'admin',
};

const ACTIONS = {
  SENT_USER: 'sent_user',
  SENT_ADMIN: 'sent_admin',
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const initialState = {
  count: 0,
  messages: [
    // {
    //   dateCreated: '20/12/2022',
    //   type: TYPES.USER,
    //   groupMessage: [
    //     {
    //       id: uuid.v4(),
    //       type: TYPES.USER,
    //       message: 'hello1',
    //       dateCreated: new Date(),
    //     },
    //     {
    //       id: uuid.v4(),
    //       type: TYPES.USER,
    //       message: 'hello2',
    //       dateCreated: new Date(),
    //     },
    //   ],
    // },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SENT_USER:
      if (state.messages.length > 0) {
        const currentDateTime = new Date().getTime();
        const messageUser = {
          id: uuid.v4(),
          type: TYPES.USER,
          message: action.message,
          dateCreated: new Date(),
        };
        let indexOfLastItem = -1;
        const found = state.messages.findLast((e, i) => {
          if (e.type === TYPES.USER) {
            indexOfLastItem = i;
            console.log(i);
            return true;
          }
        });

        console.log('indexOfLastItem', indexOfLastItem);
        if (
          currentDateTime -
            new Date(state.messages[indexOfLastItem].dateCreated).getTime() >=
          120000
        ) {
          // create new group messages
          console.log('11');

          const addNewMessageUser = {
            dateCreated: new Date(),
            type: TYPES.USER,
            groupMessage: [
              {
                id: uuid.v4(),
                type: TYPES.USER,
                message: action.message,
                dateCreated: new Date(),
              },
            ],
          };

          return {messages: [addNewMessageUser, ...state.messages]};
        } else {
          // add a message to a group messages
          // lastMessage.groupMessage.push(messageUser);
          const newMessages = state.messages;
          newMessages[state.messages.length - 1].groupMessage.push(messageUser);
          console.log('newMessages', newMessages);
          return {messages: newMessages};
        }
      } else {
        // create first messages
        const newMessageUser = {
          dateCreated: new Date(),
          type: TYPES.USER,
          groupMessage: [
            {
              id: uuid.v4(),
              type: TYPES.USER,
              message: action.message,
              dateCreated: new Date(),
            },
          ],
        };
        return {messages: [newMessageUser]};
      }
    case ACTIONS.SENT_ADMIN:
      const newMessageAdmin = {
        dateCreated: new Date(),
        type: TYPES.ADMIN,
        groupMessage: [
          {
            id: uuid.v4(),
            type: TYPES.ADMIN,
            message: action.message,
            dateCreated: new Date(),
          },
        ],
      };
      return {messages: [newMessageAdmin, ...state.messages]};
    default:
      throw new Error();
  }
}

const ChatScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [msg, setMsg] = useState('');
  const ref = useRef(null);

  const renderItem = ({item}) => {
    console.log('item', item);
    if (item.type === TYPES.USER) {
      return (
        <View key={item.dateCreated}>
          <Text style={styles.dateCreated}>
            {moment(item.dateCreated).format('LT')}
          </Text>
          {item.groupMessage.map((e, i) => {
            return (
              <View style={styles.wrapUserMessage} key={e.id}>
                <View style={styles.userMessage}>
                  <Text style={styles.userTitle}>{e.message}</Text>
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      return (
        <View style={styles.wrapAdminMessage} key={item.dateCreated}>
          <Image
            source={{
              uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/ce54bf11889067.562541ef7cde4.png',
            }}
            style={styles.avatar}
          />
          <View style={styles.adminMessage}>
            <Text style={styles.adminTitle}>{item.message}</Text>
          </View>
        </View>
      );
    }
  };

  const _renderFlatList = useMemo(() => {
    return (
      <FlatList
        ref={ref}
        style={styles.chatList}
        data={state.messages}
        keyExtractor={item => {
          return item.id;
        }}
        inverted
        renderItem={e => renderItem(e)}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={100}
        windowSize={7}
      />
    );
  });

  const send = type => {
    dispatch({type: type, message: msg});
  };
  return (
    // <SafeAreaView>
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboard}
        keyboardVerticalOffset={windowHeight - 1000}>
        {_renderFlatList}
        <View>
          <TextInput
            value={msg}
            placeholderTextColor="#000"
            onChangeText={setMsg}
            blurOnSubmit={false}
            onSubmitEditing={() => send(ACTIONS.SENT_USER)}
            placeholder="Enter a message"
            returnKeyType="send"
            style={styles.textInput}
          />
          <View style={styles.groupBtn}>
            <TouchableOpacity
              style={styles.uBtn}
              onPress={() => send(ACTIONS.SENT_USER)}>
              <Text>U</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => send(ACTIONS.SENT_ADMIN)}>
              <Text>A</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateCreated: {
    textAlign: 'center',
  },
  wrapAdminMessage: {
    flexDirection: 'row',
  },
  userMessage: {
    maxWidth: (windowWidth - 32 + 10) / 2,
    backgroundColor: '#37CDE6',
    paddingVertical: 5,
    marginVertical: 8,
    borderRadius: 5,
  },
  adminMessage: {
    maxWidth: (windowWidth - 32 + 10) / 2,
    backgroundColor: '#669EE9',
    paddingVertical: 5,
    marginVertical: 8,
    borderRadius: 5,
  },
  userTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 10,
  },
  adminTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    paddingHorizontal: 10,
  },
  chatList: {
    // backgroundColor: 'green',
    paddingHorizontal: 10,
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: 'black',
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 5,
    zIndex: 9,
    paddingLeft: 15,
  },
  keyboard: {
    flex: 1,
  },
  groupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 40,
    top: 25,
    zIndex: 10,
  },
  uBtn: {
    marginRight: 10,
  },
  wrapUserMessage: {
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    alignItems: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default ChatScreen;
