import React from "react";
import { Words } from "../../constants";
import { PoemCard } from "../../components/PoemCard";

export class Shi extends React.Component {
    props: any;
    static navigationOptions = ({navigation}) => ({
        drawerLabel: Words.shi,
    });

    render() {
        return (
            <PoemCard type={"Shi"} />
        );
    }
}