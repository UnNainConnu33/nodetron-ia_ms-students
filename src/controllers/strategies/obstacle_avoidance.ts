class Tile {
    public id: number = 0;
}

// let res = 0.5;
// const nCol = Math.round(state.world.field.width + 1.0 / res)
// const nRow = Math.round(state.world.field.length + 1.0 / res)
// this.grid = Array.from({ length: nCol },
//   () => Array.from({ length: nRow }, () => new Tile()))

let nCol = 3;
let nRow = 3;
let grid: Array<Array<Tile>> = [];

for (let col = 0; col < nCol; col++) {
    grid[col] = new Array()
    for (let row = 0; row < nRow; row++) {
        grid[col][row] = new Tile()
    }
}

// for(let col = 0; col < nCol; col++) {
//     for(let row = 0; row < nRow; row++) {
//        grid[col][row].id = 2
//    }
//}

grid.forEach(row => {
    row.forEach(tile => tile.id = 2)
})


// grid = [...new Array(3)].map(()=> [...new Array(3)].map(()=> new Tile()));

grid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => new Tile()))

grid[0][0].id = 1
grid[1][1].id = 3
console.log(grid)