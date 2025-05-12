import fastify from 'fastify'
import queryRoutes from './routes/query'
import formDataRoutes from './routes/form_data'
import errorHandler from './errors'

function build(opts = {}) {
  const app = fastify(opts)

  app.register(formDataRoutes, { prefix: '/form-data' })
  app.register(queryRoutes, { prefix: '/query' })

  app.setErrorHandler(errorHandler)

  return app
}
export default build
