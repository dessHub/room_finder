
module.exports=[
	{
    'environment': 'production',
    'url'       : 'mongodb://localhost/kejahunt',
    'secret'    : 'nosecrets'
  },

  {
    'environment': 'production',
    'url'       : process.env.MONGOLAB_URI,
    'secret'    : 'nosecrets'
  },

  {
    'environment': 'test',
    'url'       : 'mongodb://localhost/room-finder',
    'secret'    : 'nosecrets'
  }
]
