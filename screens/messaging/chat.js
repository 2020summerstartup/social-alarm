import React, { Component } from 'react';
/*import ToggleSwitch from "../../components/toggleSwitch";

export default function Navigation() {
    return (
        <ToggleSwitch />
    );
  }
*/

import { GiftedChat } from 'react-native-gifted-chat'

export default class Example extends Component {
  state = {
    messages: [],
  }


  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'Yes, and I use Gifted Chat!',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Shifa Somji',
          },
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'Are you building a chat app?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
        {
          _id: 1,
          text: 'This is a quick reply. Do you love Gifted Chat?',
          createdAt: new Date(),
          quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: true,
            values: [
              {
                title: '😋 Yes',
                value: 'yes',
              },
              {
                title: '📷 Yes, let me show you with a picture!',
                value: 'yes_picture',
              },
              {
                title: '😞 Nope. What?',
                value: 'no',
              },
            ],
          },
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
        
      ],
    })
  }

  // Adds the new message to the array of messages in the state
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1, // TO DO: figure out what this does, i'm not sure yet
        }}
      />
    )
  }
}