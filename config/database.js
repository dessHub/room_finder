
module.exports=[
	{
    'environment': 'production',
    'url'       : 'mongodb://desshub:kejahunt@ds163010.mlab.com:63010/kejahunt',
    'secret'    : 'nosecrets'
  },

  {
    'environment': 'productio',
    'url'       : process.env.MONGOLAB_URI,
    'secret'    : 'nosecrets'
  },

  {
    'environment': 'test',
    'url'       : 'mongodb://localhost/room-finder',
    'secret'    : 'nosecrets'
  }
]
