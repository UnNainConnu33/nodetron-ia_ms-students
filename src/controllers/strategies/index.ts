import { FunctionAssignmentNodeDependencies } from 'mathjs'
import Triangle from './triangle'
import Template from './template'
import Square from './square'
import Losange from './losange'
import Stalk from './stalk'
import Test from './test'
import Follow_ball from './follow_ball'
//import Pathfinding from './Pathfinding'
//import ZigZag from './zigZag'
//import UseZigZag from './useZigZag'
import MoveTo from './MoveTo'
import Shoot from './shoot'
import Around from './around'
import Backwards from './backwards'
import Wall from './wall'
import AStar from './astar'
import semiCircle from './semiCircle'
import Line from './line'
import Goalkeeper from './goalkeeper'
import uTurn from './uTurn'
import KickShoot from './kick'


export default {
  triangle: Triangle.declaration,
  template: Template.declaration,
  square: Square.declaration,
  losange: Losange.declaration,
  stalk: Stalk.declaration,
  shoot: Shoot.declaration,
  follow_ball: Follow_ball.declaration,
  //pathfinding: Pathfinding.declaration,
  //zigZag: ZigZag.declaration,
  //useZigZag: UseZigZag.declaration,
  MoveTo: MoveTo.declaration,
  Around: Around.declaration,
  Test: Test.declaration,
  Backwards: Backwards.declaration,
  Wall: Wall.declaration,
  astar: AStar.declaration,
  semiCircle: semiCircle.declaration,
  line: Line.declaration,
  goalkeeper: Goalkeeper.declaration,
  uTurn: uTurn.declaration,
  kickShoot: KickShoot.declaration,
}
