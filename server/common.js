import apiFetch from "./apiFetch";

export async function getBoard(params) {
  return apiFetch.get(`/common/board`, params);
}

export async function getFeedback(params) {
  return apiFetch.get(`/common/feedback`, params);
}

export async function fetchFeedbackComments(params) {
  return apiFetch.get(`/common/feedback-comments`, params);
}

export async function toggleFeedbackVote(body) {
  return apiFetch.post(`/common/feedback/vote`, body);
}
