const config = {

  devServer: {

    proxy: {

      '^/api':

        {

          target: 'http://localhost:8090',

        }

    },

  },

}

module.exports = config
