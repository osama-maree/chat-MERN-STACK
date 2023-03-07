const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: {
          name: action.payload.Name,
          id: action.payload.id,
          img: action.payload.image,
        },
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "UPDATE": 
      return {
        user: {
          name: action.payload.name,
          id: action.payload.id,
          img: action.payload.profilePic,
        },
        isFetching: false,
        error: false,
      };
    

    default:
      return state;
  }
};

export default AuthReducer;
