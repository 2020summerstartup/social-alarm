import React from 'react'
import { Icon } from 'react-native-elements'

// consistent icon (>) for all categories on the profile page
const Chevron = () => (
  <Icon
    name="chevron-right"
    type="entypo"
    color="gray"
    containerStyle={{ marginLeft: -15, width: 20 }}
  />
)

export default Chevron