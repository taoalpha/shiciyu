import React from "react";
import { Words } from "../../constants";
import { PoemCard } from "../../components/PoemCard";

export class XieHouYu extends React.Component {
    props: any;
    static navigationOptions = {
        drawerLabel: Words.xiehouyu,
    };

    render() {
        return (
            <PoemCard type={"XieHouYu"} />
        )
    }
}