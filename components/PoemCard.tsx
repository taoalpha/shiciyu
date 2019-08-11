import React, {useState, useEffect} from 'react';
import {ActivityIndicator , StyleSheet, Text, View, ScrollView, RefreshControl, WebView, TouchableOpacity } from "react-native";
import poemService from "../services/Poem";
import { Colors } from "../constants";
import { Header } from "./Header";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray,
  },
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingTop: 30,
    paddingBottom: 30
  },
  closeButton: {
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topbarText: {
    color: Colors.white
  },
  text: {
    color: Colors.white,
    // TODO: should be limit based on # characters
    fontSize: 22,
    lineHeight: 24,
    fontFamily: "shi"
  }
});

export function PoemCard(props) {
  const [isLoading, setLoading] = useState(true);
  const [currentPoem, setPoem] = useState(null);
  const [webUrl, setWebUrl] = useState("");

  useEffect(() => {
    poemService.switchType(props.type).then(() => {
      setLoading(false);
      setPoem(poemService.random());
    });
  }, [props.type])

  let PoemCard = (<View style={styles.container}>
    {currentPoem && < ScrollView contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => {
            setPoem(poemService.random());
          }}
        />
      } >
      <Header
        level="h2"
        onLongPress={() => {
          setWebUrl("https://www.google.com/search?q=" + encodeURI(`${currentPoem.title} ${currentPoem.author || ""}`));
        }}
        style={{ color: Colors.white }}>{currentPoem.title || currentPoem.rhythmic}</Header>
      <Header
       level="h5"
       style={{ fontStyle: "italic", color: Colors.chinaGray, lineHeight: 24, paddingBottom: 10 }}>
        {currentPoem.author || currentPoem.origin}
       </Header>
      <Text style={styles.text}>
        {currentPoem.paragraphs ? currentPoem.paragraphs.join("\n") : currentPoem._content}
      </Text>
    </ScrollView>}
  </View>);

  let WebViewCard = (<View style={styles.container}>
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => {
        setWebUrl("");
      }}>
      <Text style={styles.topbarText}>close</Text>
    </TouchableOpacity>
    <WebView
      style={{ flex: 1 }}
      source={{ uri: webUrl }}
    />
  </View>);

  if (isLoading) {
    return (<View style={styles.container}><ActivityIndicator style={styles.contentContainer} size="large" color="#ddd" /></View>);
  } else if (webUrl) {
    return WebViewCard;
  } else {
    return PoemCard;
  }
}