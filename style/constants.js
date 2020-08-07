// https://coolors.co/generate

import React, {useState} from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

var background = "white";
var blue = "#003f5c"; // blue color, this color looks like black for most text so think about changing it
var red = "#fb5b5a"; // pink/redish color, button color
var white = "white"; // white, color for some text
var input = '#465881'; // bluish color for text inputs


function Constants() {

    const [background, setBackground] = useState("white");
    const [blue, setBlue] = useState("#003f5c");
    const [red, setRed] = useState("#fb5b5a");
    const [white, setWhite] = useState("white");
    const [input, setInput] = useState("#465881");


    return (



<NotificationContext.Consumer>{(context)=> {


    

    const {isDarkMode} = context

    if(isDarkMode){
        setBackground("black")
    } else{
        setBackground("white")
    }

    return ({
        APPBACKGROUNDCOLOR: background,
        APPTEXTBLUE: blue,
        APPTEXTRED: red,
        APPTEXTWHITE: white,
        APPINPUTVIEW: input,
    })


}}</NotificationContext.Consumer>

    )}

export default Constants;

export const APPBACKGROUNDCOLOR = background;
export const APPTEXTBLUE = blue; // blue color, this color looks like black for most text so think about changing it
export const APPTEXTRED = red; // pink/redish color, button color
export const APPTEXTWHITE = white; // white, color for some text
export const APPINPUTVIEW = input; // bluish color for text inputs
