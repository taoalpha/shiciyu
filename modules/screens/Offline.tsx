import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ListItem } from "react-native-elements";
import { Words, Endpoints } from "../../constants";
import * as FileSystem from 'expo-file-system';
import poemService from "../../services/Poem";

const FILE_REGEX = /(\w+\.)+\d+\.json/;

interface OfflineItem {
    file: string; // file name
    path: string; // url path to fetch
    title: string; // text to show
    downloaded: boolean;
    count: number;
}

interface OfflineList {
    expanded: boolean;
    category: string;
    title: string;
    items: OfflineItem[];
    count: number;
}

export function Offline() {
    const [list, setList] = useState([]);

    useEffect(() => {
        const meta = poemService.meta;
        const files = poemService.getDbList();
        if (!list.length) {
            const list = [
                { folder: "tangshi", title: Words.tangshi },
                { folder: "songshi", title: Words.songshi },
                { folder: "songci", title: Words.ci },
                { folder: "chengyu", title: Words.chengyu },
                { folder: "xiehouyu", title: Words.xiehouyu },
            ].reduce((acc, cur) => {
                if (meta[cur.folder]) {
                    acc.push({
                        expanded: false,
                        category: cur.folder,
                        title: cur.title,
                        count: meta[cur.folder]._total,
                        items: Object.keys(meta[cur.folder]).filter(key => FILE_REGEX.test(key)).map((file, i) => ({
                            path: `${Endpoints.REMOTE_URL}/${cur.folder}/${file}`,
                            title: `${Words.block} ${i}`,
                            downloaded: files.includes(file),
                            file,
                            count: meta[cur.folder][file],
                        })),
                    });
                }
                return acc;
            }, [] as OfflineList[]);

            // update states
            setList(list);
        }
    });

    return (<View>
        <FlatList
            keyExtractor={item => item.category}
            data={list}
            renderItem={({ item }) => {
                return (<View>
                    <ListItem
                        title={item.title}
                        subtitle={item.count + " " + Words.unit}
                        rightIcon={{ name: item.expanded ? "keyboard-arrow-up" : "keyboard-arrow-down" }}
                        onPress={() => {
                            item.expanded = !item.expanded;
                            setList(list.slice());
                        }}
                    />
                    {item.expanded && item.items.map(file => (<ListItem
                        key={file.file}
                        containerStyle={{ backgroundColor: "#ddd" }}
                        bottomDivider={true}
                        title={file.title}
                        subtitle={file.count + " " + Words.unit}
                        rightIcon={{
                            name: file.downloaded ? "cloud-done" : "cloud-download",
                            onPress: () => {
                                // download the file
                                if (file.downloaded) {
                                    FileSystem.deleteAsync(FileSystem.documentDirectory + file.file)
                                        .then(() => {
                                            file.downloaded = false;
                                            setList(list.slice());
                                            poemService.removeFromDbList(file.file);
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });

                                } else {
                                    FileSystem.downloadAsync(
                                        file.path,
                                        FileSystem.documentDirectory + file.file)
                                        .then(() => {
                                            file.downloaded = true;
                                            setList(list.slice());
                                            poemService.addToDbList(file.file);
                                        })
                                        .catch(e => {
                                            console.log(e);
                                        });
                                }
                            }
                        }}
                    />))}</View>);
            }}
        />
    </View>);
}