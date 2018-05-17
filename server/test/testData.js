export default {
  admin: {
    id: 1,
    username: 'john',
    password: 'wick'
  },
  regularUser1: {
    id: 4,
    username: 'uzumaki',
    password: 'naruto',
    requestsId: [4, 6, 7, 8]
  },
  regularUser2: {
    id: 3,
    username: 'wizard12',
    password: 'harry',
    requestsId: [1, 3, 5]
  },
  request1: {
    id: 1,
    title: 'Broken side mirror',
    description:
      'The side mirror is in a very bad condition, the mirror is shattered and the mirror frame is badly damaged as well.',
    type: 'repair',
    status: 'pending',
    trashed: false,
    feedback:
      'Sorry, the requested service is not available at the moment. We are out of side mirror frames',
    ownerId: 3
  }
};
