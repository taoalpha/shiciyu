import { Words } from "../constants";
import React from "react";
import {View, Text} from "react-native";
import {Icon} from "react-native-elements";
import { createDrawerNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import { BeforeLoad, Labels, LabelDetail, XieHouYu, ChengYu, Offline, Shi, Ci, Settings, Favorite } from "./screens";
import poemService from "../services/Poem";

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
                headerTitle: (<View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: "space-between",
                }}>
                    <Text style={{fontSize: 18, flex: 1}}>{navigation.state.params.label}</Text>
                    {!poemService.isEmptyLabel(navigation.state.params.label) && (<Icon name="delete"
                        containerStyle={{
                            flexBasis: 50,
                        }}
                        onPress={() => {
                            // delete the label
                            poemService.deleteLabel(navigation.state.params.label).then(() => {
                                navigation.goBack();
                            });
                        }} />)}
                </View>),
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