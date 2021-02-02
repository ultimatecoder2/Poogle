import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../shared/baseUrl";


//--------------------------AUTHENTICATION-----------------------------------/


export const signIn = (userDetails) => async (dispatch,getState) =>{
	try{
		let response = await fetch(baseUrl+'users/login', {
			method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify(userDetails)
		});

		if(response.ok){
			response = await (response.json());	
			localStorage.setItem('isSignedIn','true');
    		localStorage.setItem('userId', response.user._id);
			localStorage.setItem('token',response.token);
			dispatch({type:ActionTypes.SIGN_IN,payload:response});
		}else{
			response = await response.text();
			throw new Error(response);
		}
	}catch(err){
		dispatch({type:ActionTypes.AUTH_FAILED,payload:{error:err}});
	}
}

export const signUp = (userDetails) => async (dispatch,getState) =>{
	try{
		console.log(userDetails);
		let response = await fetch(baseUrl+'users', {
			method: 'POST', headers: {'Content-Type': 'application/json'}, body:JSON.stringify(userDetails)
		});
		console.log(response);

		if(response.ok){
			response = await (response.json());	
			localStorage.setItem('isSignedIn',true);
    		localStorage.setItem('userId', response.user._id);
			localStorage.setItem('token',response.token);
			dispatch({type:ActionTypes.SIGN_UP,payload:response});
		}else{
			response = await response.text();
			console.log("Eror", response);
			throw new Error(response);
		}
	}catch(err){
		dispatch({type:ActionTypes.AUTH_FAILED,payload:{error:err}});
	}
}

// Add authorization header in request and modify the logout
export const logOut = (userToken) => async (dispatch,getState) =>{
	try{
		let bearer_token = 'Bearer '+userToken.token;
		let response = await fetch(baseUrl+'users/logout', {
			method: 'POST', headers: {'Content-Type': 'application/json','Authorization':bearer_token}
		});

		console.log(response);
		if(response.ok){
			response = await (response.json());	
			localStorage.removeItem('isSignedIn');
			localStorage.removeItem('userId')
			localStorage.removeItem('token');
			dispatch({type:ActionTypes.SIGN_OUT,payload:response});
		}else{
			response = await response.text();
			throw new Error(response);
		}
	}catch(err){
		dispatch({type:ActionTypes.SIGN_OUT,payload:{error:err}});
	}
}






//**************************************************************************** */
// ------------------------------------ SPACES -------------------------------/

export const fetchSpaces = () => (dispatch) => {
	// redux thunk allows to pass an action method instead of just action object and automayically recieves dispatch parameter.

	dispatch(spacesLoading(true)); // could do this or anything at anytime as middleware operation.

	return fetch(baseUrl + "spaces")
		.then(
			(response) => {
				if (response.ok) {
					return response;
				} else {
					var error = new Error(
						"Error " + response.status + ": " + response.statusText
					);
					error.response = response;
					throw error;
				}
			},
			(error) => {
				var errmess = new Error(error.message);
				throw errmess;
			}
		)
		.then((response) => response.json())
		.then((spaces) => dispatch(addSpaces(spaces))) // perform certain operations only when certain condition is met like only without err and json format dispatch to store.
		.catch((error) => dispatch(spacesFailed(error.message))); // else dispatch for err.
};

export const spacesLoading = () => ({
	type: ActionTypes.SPACES_LOADING,
});

export const spacesFailed = (errmess) => ({
	type: ActionTypes.SPACES_FAILED,
	payload: errmess,
});

export const addSpaces = (spaces) => ({
	type: ActionTypes.ADD_SPACES,
	payload: spaces,
});
//************************************************************************************/
//--------------------------------------  QUESTIONS  ------------------------------- /

export const fetchQuestions = () => (dispatch) => {
	dispatch(questionsLoading(true));

	return fetch(baseUrl + "questions")
		.then(
			(response) => {
				if (response.ok) {
					return response;
				} else {
					var error = new Error(
						"Error " + response.status + ": " + response.statusText
					);
					error.response = response;
					throw error;
				}
			},
			(error) => {
				var errmess = new Error(error.message);
				throw errmess;
			}
		)
		.then((response) => response.json())
		.then((questions) => dispatch(addQuestions(questions)))
		.catch((error) => dispatch(questionsFailed(error.message)));
};

export const questionsLoading = () => ({
	type: ActionTypes.QUESTIONS_LOADING,
});

export const questionsFailed = (errmess) => ({
	type: ActionTypes.QUESTIONS_FAILED,
	payload: errmess,
});

export const addQuestions = (questions) => ({
	type: ActionTypes.ADD_QUESTIONS,
	payload: questions,
});

// --------------------------      ANSWERES ----------------------------------/

export const fetchAnswers = () => (dispatch) => {
	dispatch(answersLoading(true));

	return fetch(baseUrl + "answers")
		.then(
			(response) => {
				if (response.ok) {
					return response;
				} else {
					var error = new Error(
						"Error " + response.status + ": " + response.statusText
					);
					error.response = response;
					throw error;
				}
			},
			(error) => {
				var errmess = new Error(error.message);
				throw errmess;
			}
		)
		.then((response) => response.json())
		.then((answers) => dispatch(addAnswers(answers)))
		.catch((error) => dispatch(answersFailed(error.message)));
};

export const answersLoading = () => ({
	type: ActionTypes.ANSWERS_LOADING,
});

export const answersFailed = (errmess) => ({
	type: ActionTypes.ANSWERS_FAILED,
	payload: errmess,
});

export const addAnswers = (answers) => ({
	type: ActionTypes.ADD_ANSWERS,
	payload: answers,
});

// --------------------------       Comments ------------------------

export const addComment = (comment) => ({
    type: ActionTypes.ADD_COMMENT,
    payload: comment
});

export const postComment = (questionId, author, comment) => (dispatch) => {

    const newComment = {
        questionId: questionId,
        author: author,
        comment: comment
    };
	newComment.date = new Date().toISOString();
	newComment.dateNum = Date.now();
    
    return fetch(baseUrl + 'comments', {
        method: "POST",
        body: JSON.stringify(newComment),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
	.then(response => dispatch(addComment(response)))
    .catch(error =>  { console.log('post comments', error.message); alert('Your comment could not be posted\nError: '+error.message); });
};

export const fetchComments = () => (dispatch) => {    
    return fetch(baseUrl + 'comments')
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            var errmess = new Error(error.message);
            throw errmess;
      })
    .then(response => response.json())
    .then(comments => dispatch(addComments(comments)))
    .catch(error => dispatch(commentsFailed(error.message)));
};

export const commentsFailed = (errmess) => ({
	type: ActionTypes.COMMENTS_FAILED,
	payload: errmess,
});

export const addComments = (comments) => ({
	type: ActionTypes.ADD_COMMENTS,
	payload: comments,
});

export const deleteComment = (commentId) => (dispatch) => {

    //const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'comments/' + commentId, {
        method: "DELETE",
        headers: {
			"Content-Type": "application/json"
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(comments => { console.log('Comment Deleted', comments); dispatch(removeComment(commentId))})
    .catch(error => dispatch(commentsFailed(error.message)));
};

export const removeComment = (commentId) => ({
    type: ActionTypes.DELETE_COMMENT,
    payload: commentId
})

export const fetchUser = (userId) => (dispatch) => {
	dispatch(userLoading(true));
	return (
		fetch(baseUrl + "users/" + userId)
			.then(
				(response) => {
					if (response.ok) {
						return response;
					} else {
						var error = new Error(
							"Error " + response.status + ": " + response.statusText
						);
						error.response = response;
						throw error;
					}
				},
				(error) => {
					throw new Error(error.message);
				}
			)
			.then((response) => response.json())
			// .then(user=> console.log(user))
			.then((user) => dispatch(getUser(user)))
			.catch((error) => dispatch(userLoadingFailed(error.message)))
	);
};

export const userLoading = () => ({
	type: ActionTypes.USER_LOADING,
});

export const userLoadingFailed = (errmess) => ({
	type: ActionTypes.USER_FAILED,
	payload: errmess,
});

export const getUser = (user) => ({
	type: ActionTypes.GET_USER,
	payload: user,
});
