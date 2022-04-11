export class Vector{
  constructor( private _posX: number,
               private _posY: number){
    this._posX = _posX;
    this._posY = _posY;
  }

  get posX(): number {
    return this._posX;
  }

  get posY(): number {
    return this._posY;
  }
}