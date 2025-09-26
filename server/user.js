import apiFetch from "./apiFetch";

export async function generatePaymentUrl(body) {
  return apiFetch.post(`/user/generate-payment-url`, body);
}

export async function getBoard(params) {
  return apiFetch.get(`/user/board`, params);
}

export async function getBoards(params) {
  return apiFetch.get(`/user/board/all`, params);
}

export async function createBoard(body) {
  return apiFetch.post(`/user/board`, body);
}

export async function deleteBoard(params) {
  return apiFetch.delete(`/user/board`, params);
}

export async function createFeedback(body) {
  return apiFetch.post(`/user/feedback`, body);
}

export async function getFeedback(params) {
  return apiFetch.get(`/user/feedback`, params);
}

export async function deleteFeedback(params) {
  return apiFetch.delete(`/user/feedback`, params);
}

export async function updateFeedbackStatus(body) {
  return apiFetch.post(`/user/feedback/status`, body);
}

export async function addFeedbackComment(body) {
  return apiFetch.post(`/user/comment`, body);
}

export async function fetchFeedbackComments(params) {
  return apiFetch.get(`/user/comment/feedback-comments`, params);
}

export async function deleteFeedbackComment(params) {
  return apiFetch.delete(`/user/comment`, params);
}

// export * from "./domain";
