import React, { Component } from 'react';

import { GiftedChat } from 'react-native-gifted-chat'

export default class Example extends Component {
  state = {
    messages: [],
  }

  UNSAFE_componentWillMount() {
    this.setState({
      messages: [
        {
          // this is the last message
          _id: Math.round(Math.random() * 1000000),
          text: '#awesome',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'An alarm app',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Developer',
          },

          // shows two checkmarks in the corner of the message 
          sent: true,
          received: true,
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'What are you building?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'Seattle!',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Developer',
          },
          sent: true,
          received: true,
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'Where are you?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'Yes, and I use Gifted Chat!',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'Developer', // sent from the user
          },
          sent: true,
          received: true
        },

        // this is the first message
        {
          _id: Math.round(Math.random() * 1000000),
          text: 'Are you building a chat app?',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native', // the avatar is the initials, so RN in this case
          },
        },

        // this is a system message 
        // not officially a "message"
        {
          _id: Math.round(Math.random() * 1000000),
          text: "You are officially rocking GiftedChat.",
          createdAt: new Date(),
          system: true,
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
          _id: 1, // id of 1 starts with the react native's message, if the id is 2 it'll start with the user's message 
        }}
      />
    )
  }
}