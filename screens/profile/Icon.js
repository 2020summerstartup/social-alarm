import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'

// this sets the styles for all the left icons on the profile page 
// colors are customized in profile3.js
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 18,
    width: 34,
  },
})

const BaseIcon = ({ containerStyle, icon }) => (
  <View style={[styles.container, containerStyle]}>
    <Icon
      size={24}
      color="white"
      type="material"
      name="notifications"
      {...icon}
    />
  </View>
)

// prop types is basically type checking 
// so the containerStyle has to be either an object or number, icon has to be an object, etc.
BaseIcon.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  icon: PropTypes.object,
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
}

BaseIcon.defaultProps = {
  containerStyle: {},
  icon: {},
  iconStyle: {},
}

export default BaseIcon