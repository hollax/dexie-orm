
const makePosts = (limit = 10, idFrom = 1)=>{
    return Array.from(Array(limit).keys()).map(n => ({
        id: idFrom+n,
        title: `Post ${idFrom+n}`,
        body: `Body of post ${idFrom+n}`,
        status: 'publish'
    }));
} 
const makeEmployees = (limit = 10, salary = 50000, yearsOfExperience = 3, idFrom = 1)=>{
    return Array.from(Array(limit).keys()).map(n => ({
        active: 1,
        id: idFrom+n,
        name: `Employee ${idFrom+n}`,
        years_of_experience: yearsOfExperience,
        salary
    }));
} 

module.exports = {
    makeEmployees,
    makePosts
}