export default {
  admin: {
    id: 1,
    username: 'john',
    password: 'wick',
    email: 'johnwick@gmail.com',
    role: 'admin'
  },
  regularUser1: {
    id: 4,
    username: 'uzumaki',
    password: 'naruto',
    email: 'uzumakinaruto@gmail.com',
    requestsId: [4, 6, 7, 8],
    role: 'user'
  },
  regularUser2: {
    id: 3,
    username: 'wizard12',
    password: 'harry',
    email: 'harrypotter@gmail.com',
    requestsId: [1, 3, 5],
    role: 'user'
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
  request4: {
    id: 4,
    title: 'Nasty scratch on the hood',
    description: 'I need help!!!, I scratched my wife\'s new mercedes.',
    type: 'repair',
    status: 'resolved',
    trashed: false,
    feedback: 'Your request has been resolved, check your email for further instructions.',
    ownerId: 4
  },
  request5: {
    id: 8,
    title: 'Smashed my car',
    description: 'I need a complete body work done on my baby, I don\'t care how much it cost. Get it done',
    type: 'repair',
    status: 'pending',
    trashed: false,
    feedback: 'Your vehicle was badly damaged. Good news is we can fix it, but it will take a while.',
    ownerId: 4
  },
  request6: {
    id: 5,
    title: 'Interior re-design',
    description: 'Hello, I\'ll like to have the interior of my vehicle re-designed. I want a leopard skin cover on the seats.',
    type: 'maintenance',
    status: 'pending',
    trashed: false,
    feedback: 'Your request has been resolved, you\'ll really love your new seats. Check your email for further instructions.',
    ownerId: 3
  },
  request7: {
    id: 7,
    title: 'Yoooo',
    description: 'yo did you the movie last night, it was legendary...',
    type: 'repair',
    status: 'disapproved',
    trashed: true,
    feedback: '',
    owner: 'Uzumaki Naruto',
    date: Date.now() + 7,
    ownerId: 4
  },
  invalidId: 10000,
  invalidToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJ1enVtYWtpIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MjY1NDk0NDIsImV4cCI6MTUyNjYzNTg0Mn0.9UB3ic-ZtyOEWS7wgTDeec-jGmQ-1M2G4VIfnxL7Cmw1'
};
