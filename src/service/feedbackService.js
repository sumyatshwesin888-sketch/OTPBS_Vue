import axios from "../config" 

class feedbackService{
    axios;
    constructor(){
        this.axios = axios;
    }

     // Rating များရယူရန်
    getRatings() {
        let url = `/rating`;
        return this.axios.get(url).then(request => request.data);
    }


    deleteRating(id){

    let url = `/rating/${id}`

    return this.axios.delete(url)
        .then(res=>res.data)

}

    getComments() {
        let url = `/comment`;
        return this.axios.get(url).then(request => request.data);
    }
    
   
    
    updateComment(commentId, dto) {
        let url = `/comment/${commentId}`;
        return this.axios.put(url, dto).then(request => request.data);
    }

    // Comment ကို Delete လုပ်ရန်
    deleteComment(commentId) {
        let url = `/comment/${commentId}`;
        return this.axios.delete(url).then(request => request.data);
    }

     getMessages() {
    return this.axios.get("/message")
      .then(res => res.data);
  }

  updateMessage(messageId, dto) {
    return this.axios.put(`/message/${messageId}`, dto)
      .then(res => res.data);
  }

  deleteMessage(messageId) {
    return this.axios.delete(`/message/${messageId}`)
      .then(res => res.data);
  }

  getQuestionTypes() {
    return this.axios.get("/questionType")
      .then(res => res.data);
  }

  
    
}

const service = new  feedbackService();
export default service;