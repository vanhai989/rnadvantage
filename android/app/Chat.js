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
  messages: [],
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SENT_USER:
      const messageUser = {
        id: uuid.v4(),
        type: TYPES.USER,
        message: action.message,
      };
      const newMessages1 = [messageUser, ...state.messages];
      return {messages: newMessages1};
    case ACTIONS.SENT_ADMIN:
      const messageAdmin = {
        id: uuid.v4(),
        type: TYPES.ADMIN,
        message: action.message,
      };
      const newMessages2 = [messageAdmin, ...state.messages];
      return {messages: newMessages2};
    default:
      throw new Error();
  }
}

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const ChatScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [msg, setMsg] = useState('');
  const ref = useRef(null);

  const renderItem = ({item}) => <Item title={item.message} />;

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
  }, [state.messages]);

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
            onSubmitEditing={send}
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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  chatList: {
    // backgroundColor: 'green',
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: 'black',
    marginBottom: 10,
    borderRadius: 5,
    zIndex: 9,
  },
  keyboard: {
    flex: 1,
  },
  groupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 40,
    top: 15,
    zIndex: 10,
  },
  uBtn: {
    marginRight: 10,
  },
});

export default ChatScreen;
