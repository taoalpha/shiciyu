import { Words } from "../constants";
import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import { BeforeLoad, XieHouYu, ChengYu, Offline, Shi, Ci, Settings } from "./screens";

const SettingsScreen = createStackNavigator(
    {
        Main: {
            screen: Settings,
            navigationOptions: {
                title: Words.settings,
            }
        },
        Offline: {
            screen: Offline,
            navigationOptions: {
                title: Words.offline,
            }
        },
    },
    {
        navigationOptions: {
            title: Words.settings,
        }
    }
);

const AppNavigator = createDrawerNavigator({
    Home: {
        path: "/index",
        screen: BeforeLoad,
        navigationOptions: {
            drawerLabel: () => null
       }
    },
    Shi: {
        path: '/shi',
        screen: Shi,
    },
    Ci: {
        path: '/ci',
        screen: Ci,
    },
    ChengYu: {
        path: "/chengyu",
        screen: ChengYu
    },
    XieHouYu: {
        path: "/xiehouyu",
        screen: XieHouYu
    },
    Settings: {
        path: '/settings',
        screen: SettingsScreen,
    },
}, {
        initialRouteName: "Home"
    });

export default createAppContainer(AppNavigator);