export function getPath(grid, finish)
{
    const {row, col}=finish;
    finish=grid[row][col];
    const shortestPath=[];
    let current=finish;
    while(current!==null)
    {
        shortestPath.push(current);
        current=current.prev;
    }
    return shortestPath;
}