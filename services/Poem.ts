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

interface PoemData {
    author?: string, 
    origin?: string,
    _content?: string,
    artist?: string,
    paragraphs?: string[],
    strains?: string[],
    title?: string,
    rhythmic?: string
}

const CACHED_FILES = new Map<string, PoemData[]>();
async function loadFile(path: string) {
  if (!CACHED_FILES.has(path)) {
    CACHED_FILES.set(path, JSON.parse(await FileSystem.readAsStringAsync(FileSystem.documentDirectory + path)));
  }
  return CACHED_FILES.get(path);
}

class Poem {
  meta: any = null;
  _dbList: string[] = [];

  // user histories
  histories: PoemHistory = {};

  // state
  currentActiveDB: PoemData[] = [];
  currentActiveDBName = "";
  currentActiveIndex = 0;

  constructor() {}

  private async getDBFor(type: string) {
    if (type === "Shi") {
      return await this.getDBWith("shi.", LOCAL_SHI);
    } else if (type === "Ci") {
      return await this.getDBWith("ci.", LOCAL_CI);
    } else if (type === "ChengYu") {
      return await this.getDBWith("idioms.", LOCAL_CHENGYU);
    } else if (type === "XieHouYu") {
      return await this.getDBWith("xiehouyu.", LOCAL_XIEHOUYU);
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

  get(id: number): PoemData {
    return this.currentActiveDB[id];
  }

  random(): PoemData {
    return this.currentActiveDB[Math.floor(Math.random() * this.currentActiveDB.length)];
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

export default new Poem();