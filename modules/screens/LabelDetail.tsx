import React from "react";
import { PoemCard } from "../../components/PoemCard";

export function LabelDetail({navigation}) {
    const state = navigation.state;
    if (!state.params || !state.params.label) return navigation.goBack();
    return (
        <PoemCard type={`Labels.${state.params.label}`} navigation={navigation} />
    );
}