module.exports = [
  {
    type: 'select',
    name: 'type',
    message: 'Task type',
    choices: ['one-time', 'regular'],
  },
  {
    type: 'confirm',
    name: 'useData',
    message: 'Use task data?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'prisma',
    message: 'Import prisma?',
    default: true,
  },
]
