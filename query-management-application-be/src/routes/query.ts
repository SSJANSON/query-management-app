import { FastifyInstance } from 'fastify'

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { IQuery, ICountedQuery } from './schemas/query.interface'
import { ApiError } from '../errors'

async function queryRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'queryRoutes' })

  // ENDPOINT: GET/query - fetch queries
  app.get<{
    Reply: ICountedQuery
  }>('', {
    async handler(req, reply) {
      log.debug('get form data')
      try {
        const query = await prisma.query.findMany({})
        reply.send({
          total: query.length,
          query,
        })
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch query', 400)
      }
    },
  })

  // ENDPOINT: POST/query - create a query for a form data entry
  app.post<{
    Body: { title: string, description: string, createdAt: Date, status: string, formDataId: string }
    Reply: IQuery
  }>('', {
    async handler(req, reply) {
        const { title, description, status, formDataId } = req.body;
  
        if (!title || !description ) {
          throw new ApiError("Invalid query: fields are missing", 400);
        }
        try {
          console.log('Available models:', Object.keys(prisma));
          const newQuery = await prisma.query.create({
            data: {title, description, status, formDataId },
          });
          reply.code(200).send(newQuery);
        } catch (err: any) {
          log.error({ err }, err.message);
          throw new ApiError("failed to create query", 400)
        }
      },
  })

  // ENDPOINT: UPDATE/query - update query for a form data entry
  app.put<{
    Params: { id: string },
    Body: { title?: string, description?: string, status?: string, formDataId?: string },
    Reply: IQuery
  }>('/:id', {
    async handler(req, reply) {
      const { id } = req.params;
      const { title, description, status, formDataId } = req.body;
  
      try {
        // Check if the query exists
        const existingQuery = await prisma.query.findUnique({ where: { id } });
        if (!existingQuery) {
          throw new ApiError("Query not found", 404);
        }
  
        const updatedQuery = await prisma.query.update({
          where: { id },
          data: {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(status !== undefined && { status }),
            ...(formDataId !== undefined && { formDataId }),
          },
        });
  
        reply.code(200).send(updatedQuery);
      } catch (err: any) {
        log.error({ err }, err.message);
        throw new ApiError("Failed to update query", 400);
      }
    }
  })

  // ENDPOINT: POST/delete - create a query for a form data entry
  app.delete<{
    Params: { id: string },
    Reply: { message: string }
  }>('/:id', {
    async handler(req, reply) {
      const { id } = req.params;
  
      try {
        // Check if the query exists
        const existingQuery = await prisma.query.findUnique({ where: { id } });
        if (!existingQuery) {
          throw new ApiError("Query not found", 404);
        }
  
        // Delete the query
        await prisma.query.delete({ where: { id } });
  
        reply.code(200).send({ message: 'Query deleted successfully' });
      } catch (err: any) {
        log.error({ err }, err.message);
        throw new ApiError("Failed to delete query", 400);
      }
    }
  })
}



export default queryRoutes
