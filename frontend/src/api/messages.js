import { request } from './client.js';

export function sendMessage(senderId, receiverId, propertyId, content) {
  return request(`/api/messages?senderId=${senderId}&receiverId=${receiverId}&propertyId=${propertyId}`, {
    method: 'POST',
    body: { content }
  });
}

export function fetchThread(user1Id, user2Id, propertyId) {
  return request(`/api/messages/thread?user1Id=${user1Id}&user2Id=${user2Id}&propertyId=${propertyId}`);
}

export function fetchInbox(userId) {
  return request(`/api/messages/inbox/${userId}`);
}
