import React, {useState, useEffect} from 'react';
import {ActivityIndicator , StyleSheet, Text, View, ScrollView, RefreshControl, WebView, TouchableOpacity } from "react-native";
import poemService from "../services/Poem";
import { Colors } from "../constants";
import { Header } from "./Header";
import { Icon, Overlay } from 'react-native-elements'
import {LabelEditor} from "./LabelEditor";

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
  labelIcon: {
    position: 'absolute',
    top: 50,
    right: 60,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
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
  const [isLabelEditorOpen, setLabelEditorOpen] = useState(false);

  useEffect(() => {
    poemService.switchType(props.type).then(() => {
      setLoading(false);

      if (!poemService.isEmpty) {
        setPoem({...poemService.random()});
      }
    });

    const listener = props.navigation.addListener("didFocus", () => {
      poemService.switchType(props.type).then(() => {
        if (!poemService.isEmpty) {
          // make sure we get the latest state of the poem from poemService
          setPoem(curPoem => {
            if (curPoem) {
              return {...poemService.getPoem(curPoem)};
            } else {
              return {...poemService.random()};
            }
          });
        }
      });
    });
    return () => listener.remove();
  }, [props.type]);

  let PoemCard = (<View style={styles.container}>
    {currentPoem && <ScrollView contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => {
            setPoem({...poemService.random()});
          }}
        />
      } >
      <Icon
       containerStyle={styles.labelIcon}
       iconStyle={{paddingHorizontal: 5, paddingVertical: 10}}
       name='label'
       color='white'
       onPress={() => {
         // add / remove labels
         setLabelEditorOpen(prev => !prev);
       }}
      />

      { isLabelEditorOpen && (
      <Overlay
        isVisible
        height='auto'
        onBackdropPress={() => setLabelEditorOpen(false)}>
        <LabelEditor
          poem={currentPoem}
          onLabelChange={(poem) => {
            if (poem) setPoem({...poem});
            else setPoem({...poemService.random()});
          }}
        ></LabelEditor>
      </Overlay>
      )}
  
      <Icon
       containerStyle={styles.favoriteIcon}
       iconStyle={{paddingHorizontal: 5, paddingVertical: 10}}
       name={currentPoem.isFavorite ? 'favorite' : 'favorite-border'}
       color={currentPoem.isFavorite ? 'red' : 'white'}
       onPress={() => {
         let promise;
         if (!currentPoem.isFavorite) {
           promise = poemService.favorite(currentPoem);
         } else {
           promise = poemService.unFavorite(currentPoem);
         }
         promise.then(poem => {
            setPoem(poem ? {...poem} : null);
         });
       }}
      />
      <Header
        level="h2"
        onLongPress={() => {
          setWebUrl("https://www.google.com/search?q=" + encodeURI(`${currentPoem.title} ${currentPoem.author || ""}`));
        }}
        style={{ color: Colors.white }}>
        {currentPoem.title || currentPoem.rhythmic}
      </Header>
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
  } else if (poemService.isEmpty) {
    return (<View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setPoem(poemService.isEmpty ? null: {...poemService.random()});
            }}
          />
        } >
        <Header
         level="h5"
         style={{ fontStyle: "italic", color: Colors.chinaGray, lineHeight: 24, paddingBottom: 10 }}>
           尚未添加任何数据!
         </Header>
      </ScrollView>
    </View>);
  } else if (webUrl) {
    return WebViewCard;
  } else {
    return PoemCard;
  }
}