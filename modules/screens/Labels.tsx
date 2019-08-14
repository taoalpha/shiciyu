import React, { useState, useEffect } from "react";
import { ScrollView , View } from "react-native";
import { Words } from "../../constants";
import { ListItem } from "react-native-elements";
import poemService from "../../services/Poem";

export function Labels(props) {
    const [labels, setLabels] = useState(poemService.getAllLabels());

    useEffect(() => {
        const listener = props.navigation.addListener("didFocus", () => {
            setLabels([...poemService.getAllLabels()]);
        });
        return () => listener.remove();
    }, [])

    return (<ScrollView>
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
    </ScrollView>);
}