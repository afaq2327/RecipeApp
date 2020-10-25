import axios from 'axios';

//Class for serching specific recipe
export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults(){
        try{
            const result = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);//AJAX call
            this.recipes = result.data.recipes;
            // console.log(this.recipes);
        }
        catch(error){
            alert("No such recipe found!");
        }
    }
};