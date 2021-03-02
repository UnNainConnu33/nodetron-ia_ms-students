/* eslint-disable no-plusplus */
/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable max-classes-per-file */
import * as fs from 'fs'

import { Point } from '@nodetron/math/point2D'

import { state } from '../../../models/state'

export class Tile {
  public visited = false

  public weight = 0.0

  public gScore = 1e10

  public parent: Tile | null = null

  constructor(public i: number, public j: number) { }
}

export class Grid {
  public xlen: number

  public ylen: number

  public shift: { x: number, y: number }

  public data: Array<Array<Tile>>

  constructor(public resolution: number) {
    const l = state.world.field.length + 1.0
    const w = state.world.field.width + 1.0

    this.shift = {
      x: l / 2.0,
      y: w / 2.0,
    }

    this.xlen = l / resolution
    this.ylen = w / resolution

    if (this.xlen < 1 && this.ylen < 1) {
      throw new Error('Problem with grid')
    }

    this.data = []
    for (let j = 0; j < this.ylen; j++) {
      this.data[j] = []
      for (let i = 0; i < this.xlen; i++) {
        this.data[j][i] = new Tile(i, j)
      }
    }
  }

  public cellToCoord(i: number, j: number): Point {
    return new Point(
      i * this.resolution - this.shift.x,
      j * this.resolution - this.shift.y,
    )
  }

  public coordToCell(x: number, y: number): Point {
    return new Point(
      Math.round((x + this.shift.x) / this.resolution),
      Math.round((y + this.shift.y) / this.resolution),
    )
  }

  public fillGrid(id: number): void {
    for (let j = (this.ylen - 1); j >= 0; --j) {
      for (let i = 0; i < this.xlen; ++i) {
        const p = this.cellToCoord(i, j)

        // Todo : Change this with feature Box.
        if (p.y >= -0.5 && p.y <= 0.5 && p.x <= -4.5 && p.x >= -4.7) {
          this.data[j][i].weight = Math.max(this.data[j][i].weight, 100.0)
        }
        if (p.y >= -0.5 && p.y <= 0.5 && p.x >= 4.5 && p.x <= 4.7) {
          this.data[j][i].weight = Math.max(this.data[j][i].weight, 100.0)
        }

        state.world.robots.allies.forEach((robot) => {
          if (robot.id === id) return

          const d = p.distance(robot.position)
          let w = 100.0
          if (d > this.resolution) {
            w = 10.0 / (d / this.resolution)
          }

          this.data[j][i].weight = Math.max(this.data[j][i].weight, w)
        })

        state.world.robots.opponents.forEach((robot) => {
          const d = p.distance(robot.position)
          let w = 100.0
          if (d > this.resolution) {
            w = 10.0 / (d / this.resolution)
          }

          this.data[j][i].weight = Math.max(this.data[j][i].weight, w)
        })
      }
    }
  }

  public debugHeatMap(name: string): void {
    const file = fs.createWriteStream(`${name}.ppm`)

    file.write('P3 \n\n')
    file.write(`${this.xlen} ${this.ylen - 1}\n`)
    file.write('255\n')

    const range = 10
    let alpha = 0

    for (let j = (this.ylen - 1); j >= 0; --j) {
      for (let i = 0; i < this.xlen; ++i) {
        // Format weight
        this.data[j][i].weight = this.data[j][i].weight >= 9.5
          ? 10.0
          : Math.round(this.data[j][i].weight)

        alpha = Math.abs(range - this.data[j][i].weight) / range

        let R: number
        let G: number
        let B: number
        if (this.data[j][i].weight >= 9.5) {
          R = 0
          G = 0
          B = 255
        } else {
          R = Math.trunc(alpha * 200.0 + (1.0 - alpha) * 255.0)
          G = Math.trunc(alpha * 200.0 + (1.0 - alpha) * 0.0)
          B = Math.trunc(alpha * 200.0 + (1.0 - alpha) * 0.0)
        }
        file.write(`${R} ${G} ${B} `)
      }
    }

    file.write('\n')
    file.close()
  }
}