// Feel free to add to this style sheet so we can make the screens  consistent throughout our app 

import { StyleSheet } from 'react-native';
import {APPBACKGROUNDCOLOR} from './constants';

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APPBACKGROUNDCOLOR,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 10
        },

    modalToggle: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#fb5b5a",
        padding: 10,
        borderRadius: 10,
        alignSelf: "flex-end",
        color: "#fb5b5a",
    },

    modalContainer: {
        backgroundColor: "#003f5c",
        flex: 1,
        alignItems: "center",
        padding: 15,
        paddingTop: 0
    },

    modalClose: {
        marginTop: 50,
        marginBottom: 0,
    },
})

export {appStyles}
  