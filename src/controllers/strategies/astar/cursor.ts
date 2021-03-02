import { Point } from '@nodetron/math/point2D'

import { Grid, Tile } from './grid'

/* eslint-disable import/prefer-default-export */
export class Cursor {
  // Todo i et j instead of x y
  public x = 0;

  public y = 0;

  constructor(public grid: Grid) { }

  public findNeighbour(): Array<Point> {
    const v: Array<Point> = []

    // Left - Right
    if (this.x > 0) v.push(new Point(this.x - 1, this.y))
    if (this.y > 0) v.push(new Point(this.x, this.y - 1))

    // Top - Bottom
    if (this.x < (this.grid.xlen - 1)) {
      v.push(new Point(this.x + 1, this.y))
    }

    if (this.y < (this.grid.ylen - 1)) {
      v.push(new Point(this.x, this.y + 1))
    }

    // Left-Top
    if (this.x > 0 && this.y > 0) {
      v.push(new Point(this.x - 1, this.y - 1))
    }
    // Left-Bottom
    if (this.x > 0 && this.y < (this.grid.ylen - 1)) {
      v.push(new Point(this.x - 1, this.y + 1))
    }
    // Right-Top
    if (this.x < (this.grid.xlen - 1) && this.y > 0) {
      v.push(new Point(this.x + 1, this.y - 1))
    }

    // Right-Bottom
    if (this.x < (this.grid.xlen - 1) && this.y < (this.grid.ylen - 1)) {
      v.push(new Point(this.x + 1, this.y + 1))
    }

    return v
  }

  public update(position: Point, real: boolean): void {
    if (real) {
      const tmp = this.grid.coordToCell(position.x, position.y)
      this.x = tmp.x
      this.y = tmp.y
    } else {
      this.x = position.x
      this.y = position.y
    }
  }

  public getTile(): Tile {
    return this.grid.data[this.y][this.x]
  }
}