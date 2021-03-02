/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionSchema, Context, ServiceBroker } from 'moleculer'
import { MoveToMessage } from '@nodetron/types/control/moveTo'
import Strategies from '@nodetron/types/task-manager/tasks/strategies'
import { AbstractPoint, Point } from '@nodetron/math/point2D'

import { state } from '../../models/state'

import { Grid } from './astar/grid'
import { Cursor } from './astar/cursor'
/**
 * This class is an example of the new way to create Strategies.
 * It is basic and needs to be improved !
 * call "MSB.astar" ' { "id" : 1, "target" : { "x" : 0, "y" : "0"}, "resolution" : 2}' (To try with npm run repl)
 */
export default class AStar extends Strategies {
  name = 'AStar';

  public constructor(public id: number, public target: Point, public resolution: number) {
    super()
  }

  public static declaration: ActionSchema = {
    params: {
      id: {
        type: 'number', min: 0, max: 15,
      },
      target: 'object',
      resolution: {
        type: 'number', min: 2,
      },
    },
      handler(ctx: Context<{ id: number, target: AbstractPoint, resolution: number }>): void {
      state.assign.register([ctx.params.id], new AStar(
        ctx.params.id,
        new Point(ctx.params.target.x, ctx.params.target.y),
        ctx.params.resolution,
      ))
    },
  }

  compute(broker: ServiceBroker): boolean {
    const robot = state.world.robots.allies[this.id]

    const grid = new Grid(0.2)
    grid.fillGrid(this.resolution)

    const openSet = new Map<string, { i: number, j: number }>()

    const c = new Cursor(grid)
    c.update(robot.position, true)

    console.log(c.x, c.y)

    openSet.set(`${c.x}${c.y}`, { i: c.x, j: c.y })

    c.getTile().gScore = 0

    while (openSet.size > 0) {
      const key = openSet.keys().next()
      const t = openSet.get(key.value)
      openSet.delete(key.value)

      if (t === undefined) { break }

      const p = new Point(t.i, t.j)
      c.update(p, false)
      const current = c.getTile()

      current.visited = true

      if (this.target.distance(grid.cellToCoord(p.x, p.y)) < grid.resolution) {
        broker.logger.info('Arrivée')
        let tileChildren = current.parent
        while (tileChildren?.parent !== undefined) {
          broker.logger.info(tileChildren)
          tileChildren = tileChildren.parent
        }
      }

      for (const neighbour of c.findNeighbour()) {
        c.update(neighbour, false)
        const currentNeighbour = c.getTile()
        if (currentNeighbour.visited) { continue }

        const g = current.gScore + p.distance(neighbour)
        if (g < currentNeighbour.gScore) {
          currentNeighbour.parent = current
          currentNeighbour.gScore = g
          openSet.set(`${c.x}${c.y}`, { i: neighbour.x, j: neighbour.y })
        }
      }
    }
    grid.debugHeatMap('test')

    return true
  }
}