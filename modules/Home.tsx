import { Words } from "../constants";
import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import { BeforeLoad, Labels, LabelDetail, XieHouYu, ChengYu, Offline, Shi, Ci, Settings, Favorite } from "./screens";

const LabelScreen = createStackNavigator(
    {
        Main: {
            screen: Labels,
            navigationOptions: {
                title: Words.labels,
            }
        },
        LabelDetail: {
            screen: LabelDetail,
            navigationOptions: ({navigation}) => ({
                title: navigation.state.params.label,
            })
        },
    },
    {
        navigationOptions: {
            title: Words.labels,
        }
    }
);
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
        navigationOptions: {
            drawerLabel: Words.shi,
        }, 
    },
    Ci: {
        path: '/ci',
        screen: Ci,
        navigationOptions: {
            drawerLabel: Words.ci,
        }, 
    },
    ChengYu: {
        path: "/chengyu",
        screen: ChengYu,
        navigationOptions: {
            drawerLabel: Words.chengyu,
        }, 
    },
    XieHouYu: {
        path: "/xiehouyu",
        screen: XieHouYu,
        navigationOptions: {
            drawerLabel: Words.xiehouyu,
        },
    },
    Favorite: {
        path: "/favorite",
        screen: Favorite,
        navigationOptions: {
            drawerLabel: Words.favorite,
        },
    },
    Labels: {
        path: "/labels",
        screen: LabelScreen,
    },
    Settings: {
        path: '/settings',
        screen: SettingsScreen,
    },
}, {
        initialRouteName: "Home"
    });

export default createAppContainer(AppNavigator);