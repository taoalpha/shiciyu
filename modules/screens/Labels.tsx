import React from "react";
import { View } from "react-native";
import { Words } from "../../constants";
import { ListItem } from "react-native-elements";
import poemService from "../../services/Poem";

export function Labels(props) {
    const labels = poemService.getAllLabels();

    return (<View>
        {
            labels.map((label, i) => (
                <ListItem
                    key={i}
                    title={label.label}
                    leftIcon={{ name: 'label'}}
                    rightTitle={`${label.total} ${Words.unit}`}
                    onPress={() => {
                        props.navigation.navigate("LabelDetail", {label: label.label});
                    }}
                />
            ))
        }
    </View>);
}