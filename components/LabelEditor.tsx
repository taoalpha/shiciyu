import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text} from "react-native";
import {Input, Badge, Icon} from "react-native-elements";
import poemService from "../services/Poem";

export function LabelEditor(props) {
    const [currentPoem, setPoem] = useState(props.poem);
    const [inputValue, setInputValue] = useState("");

    return (<View style={{ maxHeight: 300 }}>
        <ScrollView contentContainerStyle={{
            flexGrow: 0,
        }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            }}>
                {currentPoem.labels.map(label => {
                    return (<Badge
                        key={label}
                        badgeStyle={{
                            backgroundColor: "#888",
                            marginRight: 10,
                            paddingRight: 5,
                            paddingLeft: 5,
                            height: 30,
                        }}
                        value={(
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                            }}>
                                <Text style={{
                                    color: "#fff",
                                }}>{label}</Text>
                                <Icon
                                    size={20}
                                    name="delete"
                                    color="#fff"
                                    onPress={() => {
                                        poemService.removeLabel(currentPoem, label).then(poem => {
                                            setPoem({ ...poem });
                                        })
                                    }}
                                ></Icon>
                            </View>
                        )}>
                    </Badge>);
                })
                }
            </View>
            <Input placeholder='Add a new label'
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
                onSubmitEditing={({ nativeEvent }) => {
                    nativeEvent.text && nativeEvent.text.trim() && poemService.addLabel(currentPoem, nativeEvent.text.trim()).then(poem => {
                        setPoem({ ...poem });
                        setInputValue("");
                    })
                }} />
        </ScrollView></View>);
}