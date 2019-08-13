import React, { useState } from "react";
import { View, ActivityIndicator, AsyncStorage } from "react-native";
import { Endpoints } from "../../constants";
import * as FileSystem from 'expo-file-system';
import poemService from "../../services/Poem";

const FILE_REGEX = /(\w+\.)+\d+\.json/;

async function loadAndFetchMeta() {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
    // update the db list on poem service
    poemService.setDbList(files.filter(file => FILE_REGEX.test(file)));

    if (!files.includes("meta.json")) {
        await FileSystem.downloadAsync(
            `${Endpoints.REMOTE_URL}/meta.json`,
            FileSystem.documentDirectory + 'meta.json');

    }

    // store meta in service
    poemService.meta = JSON.parse(await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "meta.json"));
}


export function BeforeLoad(props) {
    const [isLoading, setLoading] = useState(true);

    Promise.all([AsyncStorage.getItem('lastActiveRoute'), AsyncStorage.getItem('userHistories'), AsyncStorage.getItem('userOpinions'), loadAndFetchMeta()])
        .then(([path, histories, opinions]) => {
            if (histories) poemService.histories = JSON.parse(histories);
            if (opinions) poemService.opinions = JSON.parse(opinions);
            props.navigation.navigate(path);
            setLoading(false);
        })
        .catch(e => {
            console.log(e);
            // default redirect to Shi
            props.navigation.navigate("Shi");
            setLoading(false);
        });

    return (<View>
        {isLoading && <ActivityIndicator size="large" color="#666" />}
    </View>);
}