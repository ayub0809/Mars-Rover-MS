import distanceDijkstra from './dijkstra.js'

export function twoDestDistance(grid, start, f1, f2)
{
    const grid1=grid.map(a=>a.map(b=>Object.assign({},b)));
    const grid2=grid.map(a=>a.map(b=>Object.assign({},b)));
    let a=distanceDijkstra(grid1, grid1[start.row][start.col], grid1[f1.row][f1.col]);
    let b=distanceDijkstra(grid2, grid1[start.row][start.col], grid1[f2.row][f2.col]);
    if(a<b)
    {
        return f1;
    }
    else
    return f2;
}