

export function bfs(grid, start, finish) 
{
    const queue=[];
    const order=[];
    queue.push(start);
    while(queue.length>0)
        {
            const curr=queue.shift();
            const {row, col}=curr;
            if(grid[row][col].isVisited===true)
            {
                continue;
            }
            const neighbours=getNeighbours(grid, curr);
            for(let i=0;i<neighbours.length;i++)
                {
                    queue.push(neighbours[i]);
                    neighbours[i].prev=curr;
                }
            grid[curr.row][curr.col].isVisited=true;
            order.push(curr);
            if(curr===finish)
                return order;
        }
    return order;
}

function getNeighbours(grid,curr)
{
    const r=curr.row;
    const c=curr.col;
    const n=[]
    if(c-1>=0)
        if((grid[r][c-1].isVisited===false)&&(grid[r][c-1].isWall===false))
            n.push(grid[r][c-1]);
    if(c+1<40)
        if((grid[r][c+1].isVisited===false)&&(grid[r][c+1].isWall===false))
            n.push(grid[r][c+1]);
    if(r-1>=0)
        if((grid[r-1][c].isVisited===false)&&(grid[r-1][c].isWall===false))
            n.push(grid[r-1][c]);
    if(r+1<25)
        if((grid[r+1][c].isVisited===false)&&(grid[r+1][c].isWall===false))
            n.push(grid[r+1][c]);
    return n;
}