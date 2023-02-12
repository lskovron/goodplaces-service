import { createVenue } from "../mongo/mongoSchema.js";

export const resolvers = {
  Query: {
    venues: async (_, __, context) => {
    //   let reports = await getReports(context.user)
    //   if (isFeatureEnabled({ tenantId: context.user.rrTenantId }, REPORTING_CANVAS_AUTHZ)) {
    //     reports = await filterReportList(reports, context.user.id)
    //   }
    //   return reports.map(translateReportDocument)
    },
    venue: async (_, args, context) => {
    //   const results = await reportUtils.getReport(context.user, args.id)
    //   return translateReportDocument(results)
    },
  },
  Mutation: {
    createVenue: async (_, args, context) => {
      console.log(args);
      createVenue(args);
    //   const newReport = args
    //   const result = await reportUtils.createReport(context.user, newReport)
    //   return translateReportDocument(result)
    },
  },
}
