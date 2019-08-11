import React from "react";
import { Words } from "../../constants";
import { PoemCard } from "../../components/PoemCard";

export class ChengYu extends React.Component {
    props: any;
    static navigationOptions = {
        drawerLabel: Words.chengyu,
    };

    render() {
        return (
            <PoemCard type={"ChengYu"} />
        )
    }
}