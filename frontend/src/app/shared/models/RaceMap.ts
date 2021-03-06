import {Vector} from "./Vector";



export class RaceMap{
  constructor(private _name: string,
              private _userId: number,
              private readonly _mapWidth: number,
               private readonly _mapHeight: number,
               private _finishLine: Array<Vector>,
               private _startLine: Array<Vector>,
               private _obstacles: Array<Vector>,
              private _mapId?: number){
    this._mapId = _mapId;
    this._name = _name;
    this._userId = _userId;
    this._mapHeight = _mapHeight;
    this._mapWidth = _mapWidth;
    this._finishLine = _finishLine;
    this._startLine = _startLine;
    this._obstacles = _obstacles;
  }

  get mapWidth(): number {
    return this._mapWidth;
  }

  get mapHeight(): number {
    return this._mapHeight;
  }


  get finishLine(): Array<Vector> {
    return this._finishLine;
  }

  get startLine(): Array<Vector> {
    return this._startLine;
  }

  get obstacles(): Array<Vector> {
    return this._obstacles;
  }

  get mapId(): number {
    return this._mapId;
  }

  set mapId(value: number) {
    this._mapId = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  set finishLine(value: Array<Vector>) {
    this._finishLine = value;
  }

  set startLine(value: Array<Vector>) {
    this._startLine = value;
  }

  set obstacles(value: Array<Vector>) {
    this._obstacles = value;
  }
}
