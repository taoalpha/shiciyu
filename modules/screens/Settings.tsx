import React from "react";
import { View } from "react-native";
import { Words } from "../../constants";
import { ListItem } from "react-native-elements";

export class Settings extends React.Component {
    props: any;
    static navigationOptions = {
        title: Words.settings,
    };

    list = [
        {
            title: Words.offline,
            icon: 'cloud-download',
            toScreen: "Offline",
        },
    ];

    render() {
        return (<View>
            {
                this.list.map((item, i) => (
                    <ListItem
                        key={i}
                        title={item.title}
                        leftIcon={{ name: item.icon }}
                        onPress={() => item.toScreen && this.props.navigation.navigate(item.toScreen)}
                    />
                ))
            }
        </View>);
    }

    _handlePress = () => {
        this.props.navigation.navigate('Home');
    }
}