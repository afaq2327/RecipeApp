export default class Like{
    constructor(){
        this.likes = []
    }

    //function to like a recipe
    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);
        this.peresistData();
        return like;
    }

    //function to delete the liked recipe
    deleteLike(id){
        const index = this.likes.findIndex(e1 => e1.id === id);
        this.likes.splice(index,1);
        this.peresistData();
    }

    //checking if the recipe is liked or not
    isLiked(id){
        return this.likes.findIndex(e1 => e1.id === id) !== -1;
    }

    //calculating the number of liked recipes
    getNumLikes(){
        return this.likes.length;
    }

    //storing the likes data to the local storage of the browser
    peresistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    //reading the peresisted data
    readStorage(){
        //retrieving the likes json from the local storage
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes = storage;
    }

}