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
    id: 3,
    title: 'Tire check',
    description: 'My tire keeps making weird noises, its driving me crazy :(',
    type: 'maintenance',
    status: 'disapproved',
    trashed: false,
    feedback: '',
    ownerId: 3
  },
  request2: {
    id: 2,
    title: 'Oil change',
    description: 'The oil looks alright, but I have been using it for more than a 3 months. I want it changed.',
    type: 'maintenance',
    status: 'approved',
    trashed: false,
    feedback: 'Your request has been approved, and is being worked on',
    ownerId: 2
  },
  request3: {
    id: 1,
    title: 'Broken side mirror',
    description: 'The side mirror is in a very bad condition, the mirror is shattered and the mirror frame is badly damaged as well.',
    type: 'repair',
    status: 'pending',
    trashed: false,
    feedback: 'Sorry, the requested service is not available at the moment. We are out of side mirror frames',
    ownerId: 3
  },
  invalidId: 10000
};
