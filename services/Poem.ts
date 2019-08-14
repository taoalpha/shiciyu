import Words from "../constants/Words";
import {AsyncStorage} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {LOCAL_SHI, LOCAL_CI, LOCAL_CHENGYU, LOCAL_XIEHOUYU} from "./LocalData";

export enum DataType {
  SHI,
  CI,
  CHENGYU,
  XIEHOUYU,
}

interface PoemHistory {
  // assumption here is the existing files will never change
  // so we only need to record the index here
  [fileName: string]: number[];
}

interface OpinionsData {
  liked: PoemData[];
  hated: PoemData[];
  labeled: {
    [label: string]: PoemData[];
  }
}

interface PoemData {
    author?: string, 
    origin?: string,
    _content?: string,
    artist?: string,
    paragraphs?: string[],
    strains?: string[],
    title?: string,
    rhythmic?: string,

    // states
    isFavorite?: boolean,
    labels?: string[],
}

const CACHED_FILES = new Map<string, PoemData[]>();
async function loadFile(path: string) {
  if (!CACHED_FILES.has(path)) {
    CACHED_FILES.set(path, JSON.parse(await FileSystem.readAsStringAsync(FileSystem.documentDirectory + path)));
  }
  return CACHED_FILES.get(path);
}

class PoemService {
  meta: any = null;
  _dbList: string[] = [];

  // user histories / opinions / post-processed data
  _opinions: OpinionsData = {liked: [], hated: [], labeled: {}};
  histories: PoemHistory = {};
  private labelHashMap: {[hash: number]: string[]} = {};
  private favoriteHashMap: {[hash: number]: [boolean, number]} = {};

  // state
  currentActiveDB: PoemData[] = [];
  currentActiveDBName = "";
  currentActiveIndex = 0;

  constructor() {}

  get opinions() {
    return this._opinions;
  }

  set opinions(data: OpinionsData) {
    this._opinions = data;
    this.buildLabelMap();
    this.buildFavoriteMap();
  }

  private async getDBFor(type: string) {
    if (type === "Shi") {
      return await this.getDBWith("shi.", LOCAL_SHI);
    } else if (type === "Ci") {
      return await this.getDBWith("ci.", LOCAL_CI);
    } else if (type === "ChengYu") {
      return await this.getDBWith("idioms.", LOCAL_CHENGYU);
    } else if (type === "XieHouYu") {
      return await this.getDBWith("xiehouyu.", LOCAL_XIEHOUYU);
    } else if (type.startsWith("Labels.")) {
      const label = type.substr(7, type.length);
      this.currentActiveDB = this.opinions.labeled[label] || [];
      this.currentActiveDBName = label;
      return this.currentActiveDBName;
    } else if (type === "Favorite") {
      this.currentActiveDB = this.opinions.liked;
      this.currentActiveDBName = "liked";
      return this.currentActiveDBName;
    } else {
      return this.currentActiveDBName;
    }
  }

  private async getDBWith(prefix: string, localBackup: PoemData[]) {
    const file = this.getRandomFile(this._dbList.filter(file => file.startsWith(prefix)));
    if (file) {
      this.currentActiveDBName = file;
      this.currentActiveDB = await loadFile(file);
    } else {
      this.currentActiveDBName = "";
      this.currentActiveDB = localBackup;
    }

    return this.currentActiveDBName;
  }

  private getRandomFile(files: string[]) {
    return files[Math.floor(Math.random() * files.length)];
  }

  getDbList() {
    return this._dbList;
  }

  setDbList(list: string[]) {
    this._dbList = list;
  }

  addToDbList(file: string) {
    if (!this._dbList.includes(file)) this._dbList.push(file);
  }

  removeFromDbList(file: string) {
    this._dbList = this._dbList.filter(f => f !== file);
  }

  switchType(type: string) {
    return this.getDBFor(type);
  }

  get isEmpty() {
    return this.currentActiveDB.length === 0;
  }

  get(id: number): PoemData {
    return this.currentActiveDB[id];
  }

  private serialize(poem: PoemData) {
    const cleanedData = {};
    // the order matters a lot, so don't change unless you have to
    [
      "author",
      "origin",
      "_content",
      "artist",
      "paragraphs",
      "strains",
      "title",
      "rhythmic",
    ].forEach(key => {
      if (poem[key]) {
        cleanedData[key] = poem[key];
      }
    });

    return JSON.stringify(cleanedData);
  }

  private buildLabelMap() {
    if (!this.opinions.labeled) return;
    Object.keys(this.opinions.labeled).forEach(label => {
      if (!this.opinions.labeled[label].length) {
        delete this.opinions.labeled[label];
      } else {
        this.opinions.labeled[label].forEach(poem => {
          const poemHash = this.getHashKey(poem);
          this.labelHashMap[poemHash] = this.labelHashMap[poemHash] || [];
          if (!this.labelHashMap[poemHash].includes(label)) this.labelHashMap[poemHash].push(label);
        });
      }
    });
  }

  private buildFavoriteMap() {
    this.opinions.liked.forEach((poem, i) => {
      this.favoriteHashMap[this.getHashKey(poem)] = [true, i];
    });
  }

  getHashKey(poem: PoemData): number {
    const poemStr = this.serialize(poem);
    let hash = 0, i, chr;
    if (poemStr.length === 0) return hash;
    for (i = 0; i < poemStr.length; i++) {
      chr = poemStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  private attachState(poem: PoemData) {
    const poemHash = this.getHashKey(poem);
    poem.labels = this.labelHashMap[poemHash] || [];
    poem.isFavorite = this.favoriteHashMap[poemHash] && this.favoriteHashMap[poemHash][0] || false;
  }

  random(): PoemData {
    const poem = this.currentActiveDB[Math.floor(Math.random() * this.currentActiveDB.length)];
    // if no, return null
    if (!poem) return null;

    this.attachState(poem);
    return poem;
  }

  getPoem(poem: PoemData) {
    this.attachState(poem);
    return poem;
  }

  async favorite(poem: PoemData) {
    this.opinions.liked.push({...poem});
    poem.isFavorite = true;
    this.favoriteHashMap[this.getHashKey(poem)] = [true, this.opinions.liked.length - 1];
    await AsyncStorage.setItem("userOpinions", JSON.stringify(this.opinions));
    return poem;
  }

  async unFavorite(poem: PoemData) {
    const hash = this.getHashKey(poem);
    const favoriteState = this.favoriteHashMap[hash];
    if (favoriteState && favoriteState[0]) {
      this.opinions.liked = this.opinions.liked.filter((_, i) => i !== favoriteState[1]);
      if (this.currentActiveDBName === "liked") this.currentActiveDB = this.opinions.liked;
      for (let i = favoriteState[1]; i < this.opinions.liked.length; i++) {
        this.favoriteHashMap[this.getHashKey(this.opinions.liked[i])] = [true, i];
      }
      await AsyncStorage.setItem("userOpinions", JSON.stringify(this.opinions));
      this.favoriteHashMap[hash] = null;
    }

    // if current in favorite
    if (this.currentActiveDB === this.opinions.liked) {
      const p = this.random();
      return p;
    }

    this.attachState(poem);
    return poem;
  }

  async addLabel(poem: PoemData, label: string) {
    const hashKey = this.getHashKey(poem);
    if (this.labelHashMap[hashKey] && this.labelHashMap[hashKey].includes(label)) return;
    this.opinions.labeled = this.opinions.labeled || {};
    this.opinions.labeled[label] = this.opinions.labeled[label] || [];
    this.opinions.labeled[label].push({...poem});
    this.labelHashMap[hashKey] = this.labelHashMap[hashKey] || [];
    this.labelHashMap[hashKey].push(label);

    await AsyncStorage.setItem("userOpinions", JSON.stringify(this.opinions));
    this.attachState(poem);
    return poem;
  }

  async removeLabel(poem: PoemData, label: string) {
    const hashKey = this.getHashKey(poem);
    this.opinions.labeled[label] = this.opinions.labeled[label].filter(p => this.getHashKey(p) !== hashKey);
    this.labelHashMap[hashKey] = this.labelHashMap[hashKey].filter(l => l !== label);

    await AsyncStorage.setItem("userOpinions", JSON.stringify(this.opinions));
    this.attachState(poem);
    return poem;
  }

  getAllLabels() {
    return Object.keys(this.opinions.labeled).map(label => ({label, total: this.opinions.labeled[label].length}));
  }

  getSeven() {
    return this.getBaseOnLength(7);
  }

  getFive() {
    return this.getBaseOnLength(5);
  }

  getBaseOnLength(len: number) {
    let p = this.random();
    while (p.paragraphs[0].split(Words.comma)[0].length !== len) {
      p = this.random();
    }
    return p;
  }
}

export default new PoemService();