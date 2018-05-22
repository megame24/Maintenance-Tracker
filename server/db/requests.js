export default [
  {
    id: 1,
    title: 'Broken side mirror',
    description: 'The side mirror is in a very bad condition, the mirror is shattered and the mirror frame is badly damaged as well.',
    type: 'repair',
    status: 'pending',
    trashed: false,
    feedback: 'Sorry, the requested service is not available at the moment. We are out of side mirror frames',
    owner: 'Harry Potter',
    date: 'may 22, 2018',
    ownerId: 3
  },
  {
    id: 2,
    title: 'Oil change',
    description: 'The oil looks alright, but I have been using it for more than a 3 months. I want it changed.',
    type: 'maintenance',
    status: 'approved',
    trashed: false,
    feedback: 'Your request has been approved, and is being worked on',
    owner: 'Monkey D. Luffy',
    date: 'may 22, 2018',
    ownerId: 2
  },
  {
    id: 3,
    title: 'Tire check',
    description: 'My tire keeps making weird noises, its driving me crazy :(',
    type: 'maintenance',
    status: 'disapproved',
    trashed: false,
    feedback: '',
    owner: 'Harry Potter',
    date: 'may 22, 2018',
    ownerId: 3
  },
  {
    id: 4,
    title: 'Nasty scratch on the hood',
    description: 'I need help!!!, I scratched my wife\'s new mercedes.',
    type: 'repair',
    status: 'resolved',
    trashed: true,
    feedback: 'Your request has been resolved, check your email for further instructions.',
    owner: 'Uzumaki Naruto',
    date: 'may 22, 2018',
    ownerId: 4
  },
  {
    id: 5,
    title: 'Interior re-design',
    description: 'Hello, I\'ll like to have the interior of my vehicle re-designed. I want a leopard skin cover on the seats.',
    type: 'maintenance',
    status: 'pending',
    trashed: false,
    feedback: 'Your request has been resolved, you\'ll really love your new seats. Check your email for further instructions.',
    owner: 'Harry Potter',
    date: 'may 22, 2018',
    ownerId: 3
  },
  {
    id: 6,
    title: 'Wheel Alignment',
    description: 'The wheels were a bit off after my last maintenance with you guys, this is unacceptable. Fix it.',
    type: 'maintenance',
    status: 'approved',
    trashed: false,
    feedback: 'We are sorry to hear that you weren\'t satisfied with our service, your request has been approved and your car is being worked on.',
    owner: 'Uzumaki Naruto',
    date: 'may 22, 2018',
    ownerId: 4
  },
  {
    id: 7,
    title: 'Yoooo',
    description: 'yo did you the movie last night, it was legendary...',
    type: 'repair',
    status: 'disapproved',
    trashed: true,
    feedback: '',
    owner: 'Uzumaki Naruto',
    date: 'may 22, 2018',
    ownerId: 4
  },
  {
    id: 8,
    title: 'Smashed my car',
    description: 'I need a complete body work done on my baby, I don\'t care how much it cost. Get it done',
    type: 'repair',
    status: 'pending',
    trashed: false,
    feedback: 'Your vehicle was badly damaged. Good news is we can fix it, but it will take a while.',
    owner: 'Uzumaki Naruto',
    date: 'may 22, 2018',
    ownerId: 4
  }
];
