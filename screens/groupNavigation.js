import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Groups from "./groups";
//import GroupDetails from "./groupDetails";

const GroupStack = createStackNavigator({
  Groups: {
    screen: Groups,
  },
  /*GroupDetails: {
        screen: GroupDetails,
    }*/
});

//const StackNavigator = createAppContainer(GroupStack);

export default GroupStack;

/*
const GroupStack = createStackNavigator();

function GroupStackScreen() {
  return (
    <GroupStack.Navigator>
      <GroupStack.Screen name="Groups" component={Groups} />
      <GroupStack.Screen name="Details" component={GroupDetails} />
    </GroupStack.Navigator>
  );
}

export default GroupStackScreen;
*/
