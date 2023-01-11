import moment from 'moment';
import React, {useMemo, useReducer, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import uuid from 'react-native-uuid';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const TYPES = {
  USER: 'user',
  ADMIN: 'admin',
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

const checkIsAddMessageToGroup = (state, indexOfLastItem, actionType) => {
  if (
    state.messages.length === 0 ||
    indexOfLastItem === -1 ||
    state.messages[0].type !== actionType
  ) {
    return true;
  }
  const currentDateTime = new Date().getTime();
  // create new group message after 2 minutes
  if (
    currentDateTime -
      new Date(state.messages[indexOfLastItem].dateCreated).getTime() <
    1200000
  ) {
    return false;
  } else {
    return true;
  }
};

const createNewGroupMessage = (message, type) => {
  return {
    dateCreated: new Date(),
    type: type,
    groupMessage: [createNewMessage(message, type)],
  };
};

const createNewMessage = (message, type) => {
  return {
    id: uuid.v4(),
    type: type,
    message: message,
    dateCreated: new Date(),
  };
};

function reducer(state, action) {
  let indexOfLastItem = -1;
  let isAddMessageToGroup = false;
  let newMessage = {};
  let newGroupMessage = [];
  const found = state.messages.findIndex((e, i) => {
    if (e.type === action.type) {
      indexOfLastItem = i;
      return true;
    }
  });
  if (['user', 'admin'].includes(action.type)) {
    isAddMessageToGroup = checkIsAddMessageToGroup(
      state,
      indexOfLastItem,
      action.type,
    );
    newMessage = createNewMessage(action.message, action.type);
    newGroupMessage = createNewGroupMessage(action.message, action.type);
  }
  switch (action.type) {
    case TYPES.USER:
      if (indexOfLastItem !== -1) {
        if (isAddMessageToGroup) {
          return {
            messages: [newGroupMessage, ...state.messages],
            count: state.count + 1,
          };
        } else {
          // add a message to a group messages
          const newMessagesUser = state.messages;
          newMessagesUser[indexOfLastItem].groupMessage.push(newMessage);
          return {messages: newMessagesUser, count: state.count + 1};
        }
      } else {
        // create first messages
        return {
          messages: [newGroupMessage, ...state.messages],
          count: state.count + 1,
        };
      }
    case TYPES.ADMIN:
      if (indexOfLastItem !== -1) {
        if (isAddMessageToGroup) {
          return {
            messages: [newGroupMessage, ...state.messages],
            count: state.count + 1,
          };
        } else {
          // add a message to a group messages
          const newMessagesAdmin = state.messages;
          newMessagesAdmin[indexOfLastItem].groupMessage.push(newMessage);
          return {messages: newMessagesAdmin, count: state.count + 1};
        }
      } else {
        return {
          messages: [newGroupMessage, ...state.messages],
          count: state.count + 1,
        };
      }
    default:
      throw new Error();
  }
}

const ChatScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [msg, setMsg] = useState('');
  const ref = useRef(null);

  const renderItem = ({item, index}) => {
    if (item.type === TYPES.USER) {
      return (
        <View key={index}>
          <Text style={styles.dateCreated}>
            {moment(item.dateCreated).format('LT')}
          </Text>
          {item.groupMessage.map(e => (
            <View style={styles.wrapUserMessage} key={e.id}>
              <View style={styles.userMessage}>
                <Text style={styles.userTitle}>{e.message}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    } else {
      return (
        <View key={index}>
          <Text style={styles.dateCreated}>
            {moment(item.dateCreated).format('LT')}
          </Text>
          <View style={styles.wrapAdminMessage} key={item.dateCreated}>
            <Image
              source={{
                uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/ce54bf11889067.562541ef7cde4.png',
              }}
              style={styles.avatar}
            />

            <View>
              {item.groupMessage.map(e => (
                <View style={styles.adminMessage} key={e.id}>
                  <Text style={styles.adminTitle}>{e.message}</Text>
                </View>
              ))}
            </View>
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
        keyExtractor={(item, index) => {
          return index;
        }}
        inverted
        renderItem={(e, i) => renderItem(e, i)}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={100}
        windowSize={7}
        showsVerticalScrollIndicator={false}
      />
    );
  }, [state.count]);

  const send = type => {
    dispatch({type: type, message: msg});
  };

  const androidTextInput = (
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
          onSubmitEditing={() => send(TYPES.USER)}
          placeholder="Enter a message"
          returnKeyType="send"
          style={styles.textInput}
        />
        <View style={styles.groupBtn}>
          <TouchableOpacity
            style={styles.uBtn}
            onPress={() => send(TYPES.USER)}>
            <Text>U</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => send(TYPES.ADMIN)}>
            <Text>A</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const iosTextInput = (
    <View style={{flex: 1}}>
      {_renderFlatList}
      <View>
        <TextInput
          value={msg}
          placeholderTextColor="#000"
          onChangeText={setMsg}
          blurOnSubmit={false}
          onSubmitEditing={() => send(TYPES.USER)}
          placeholder="Enter a message"
          returnKeyType="send"
          style={styles.textInput}
        />
        <View style={styles.groupBtn}>
          <TouchableOpacity
            style={styles.uBtn}
            onPress={() => send(TYPES.USER)}>
            <Text>U</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => send(TYPES.ADMIN)}>
            <Text>A</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {Platform.OS === 'ios' ? iosTextInput : androidTextInput}
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    </SafeAreaView>
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
    marginBottom: 5,
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
    alignItems: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default ChatScreen;
