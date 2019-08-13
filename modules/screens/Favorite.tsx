import React from "react";
import { PoemCard } from "../../components/PoemCard";

export function Favorite(props) {
    return (
        <PoemCard type={"Favorite"} navigation={props.navigation} />
    );
}