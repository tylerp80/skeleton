import { createRouter } from "../createRouter";
import {
  inputSchemaGratitudeCreate,
  inputSchemaGratitudeDelete,
  inputSchemaGratitudeList,
  inputSchemaGratitudeUpdate
} from "../schemaValidation";

export const gratitudeRouter = createRouter()
  .mutation("create", {
    input: inputSchemaGratitudeCreate,
    async resolve({ ctx, input }) {
    //  return await ctx.prisma.$transaction([
    //     ctx.prisma.gratitude.create({ data: {description: input.description}}),
    //     ctx.prisma.gratitude.create({ data: {description: input.description}}),
    //     ctx.prisma.gratitude.create({ data: {description: input.description}})
    //     ])
      return await ctx.prisma.gratitude.create({
        data: {
          description: input.description,
        },
      });
    },
  })
  .query("list", {
    input: inputSchemaGratitudeList,
    async resolve({ ctx, input }) {
      let nextCursor: string | null = null;

      if (input.cursor) {
        const data = await ctx.prisma.gratitude.findMany({
          take: 10 + 1,
          skip: 1,
          cursor: {
            id: input.cursor,
          },
          orderBy: {
            id: "desc",
          },
        });

        if (data.length > 10) nextCursor = data[9].id;

        return {
          data: data.slice(0, 10),
          nextCursor,
        };
      }

      const data = await ctx.prisma.gratitude.findMany({
        take: 10 + 1,
        orderBy: {
          id: "desc",
        },
      });

      if (data.length > 10) nextCursor = data[9].id;

      return {
        data: data.slice(0, 10),
        nextCursor,
      };
    },
  })
  .mutation("update", {
    input: inputSchemaGratitudeUpdate,
    async resolve({ ctx, input }) {
      return await ctx.prisma.gratitude.update({
        where: {
          id: input.id,
        },
        data: {
          description: input.description,
        },
      });
    },
  })
  .mutation("delete", {
    input: inputSchemaGratitudeDelete,
    async resolve({ ctx, input }) {
      return await ctx.prisma.gratitude.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
 
  
 //  return await ctx.prisma.$transaction([
    //     ctx.prisma.gratitude.create({ data: {description: input.description}}),
    //     ctx.prisma.gratitude.create({ data: {description: input.description}}),
    //     ctx.prisma.gratitude.create({ data: {description: input.description}})
    //     ])

  // }
  
  // * Delete a few Gratitudes
   // const { count } = await prisma.gratitude.deleteMany({
  //    *   where: {
  //    *     // ... provide filter here
  //    *   }
  //    * })