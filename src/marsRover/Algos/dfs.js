
export function dfs(grid, start, finish)
{
    const order=[];
    if(start.isVisited===true)
        return {found:false, order:order};
    const r=start.row;
    const c=start.col;
    grid[r][c].isVisited=true;
    order.push(start);
    let found=false;
    if(start===finish)
        return {found:true, order: order};
    if(c-1>=0)
        {
            if((grid[r][c-1].isVisited===false)&&(grid[r][c-1].isWall===false))
                {
                    grid[r][c-1].prev=start;
                    const temp=dfs(grid,grid[r][c-1],finish);
                    order.push(...temp.order);
                    found=found||temp.found;
                    if(temp.found)
                        return {found:found ,order:order};
                }
        }
    if(c+1<40)
        {
            if((grid[r][c+1].isVisited===false)&&(grid[r][c+1].isWall===false))
                {
                    grid[r][c+1].prev=start;
                    const temp=dfs(grid,grid[r][c+1],finish);
                    order.push(...temp.order);
                    found=found||temp.found;
                    if(temp.found)
                        return {found:found ,order:order};
                }
        }
    if(r-1>=0)
        {
            if((grid[r-1][c].isVisited===false)&&(grid[r-1][c].isWall===false))
                {
                    grid[r-1][c].prev=start;
                    const temp=dfs(grid,grid[r-1][c],finish);
                    order.push(...temp.order);
                    found=found||temp.found;
                    if(temp.found)
                        return {found:found ,order:order};
                }
        }
    if(r+1<25)
        {
            if((grid[r+1][c].isVisited===false)&&(grid[r+1][c].isWall===false))
                {
                    grid[r+1][c].prev=start;
                    const temp=dfs(grid,grid[r+1][c],finish);
                    order.push(...temp.order);
                    found=found||temp.found;
                    if(temp.found)
                        return {found:found ,order:order};
                }
        }
    return {
        found : found,
        order: order,
    };
}

export function getPathDFS (grid,start,finish)
{
    const path=[]
    if(finish.isVisited)
        {
            let curr=finish;
            while(curr!=null)
                {
                    path.push(curr);
                    curr=curr.prev;
                }
        }
    return path;
}
