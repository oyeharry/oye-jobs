'use strict';

var APIResponse = {
  201: {
    status: 201,
    data: {
      status: 'Success!'
    }
  },
  102: {
    status: 422,
    data: {
      status: 'Data already exist!'
    }
  },
  103: {
    status: 422,
    data: {
      status: 'Data not found!'
    }
  },
  422: {
    status: 422
  }
};

export default function(res, statusCode) {
  var codeData = APIResponse[statusCode];

  return function(data) {
    res.status(codeData.status).json(codeData.data || data);
  };
}
