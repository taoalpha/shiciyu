import React from "react";
import { Words } from "../../constants";
import { PoemCard } from "../../components/PoemCard";

export class Ci extends React.Component {
    props: any;
    static navigationOptions = {
        drawerLabel: Words.ci,
    };

    render() {
        return (
            <PoemCard type={"Ci"} />
        )
    }
}