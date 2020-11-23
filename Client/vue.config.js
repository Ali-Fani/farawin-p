const config = {

  devServer: {

    proxy: {

      '^/api':

        {

          target: 'http://localhost:8091',

        }

    },

  },

}

module.exports = config
