
export const makePosts = (limit = 10, idFrom = 1, status = 'publish')=>{
    return Array.from(Array(limit).keys()).map(n => ({
        id: idFrom+n,
        title: `Post ${idFrom+n}`,
        body: `Body of post ${idFrom+n}`,
        status: status
    }));
} 
export const makeEmployees = (limit = 10, salary = 50000, yearsOfExperience = 3, idFrom = 1, active = 1)=>{
    return Array.from(Array(limit).keys()).map(n => ({
        active,
        id: idFrom+n,
        name: `Employee ${idFrom+n}`,
        years_of_experience: yearsOfExperience,
        salary
    }));
} 

