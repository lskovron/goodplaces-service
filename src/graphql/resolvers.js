import { getVenue, createOrUpdateVenue } from "../mongo/utils.js";

export const resolvers = {
  Query: {
    venues: async (_, __, context) => {
    //   let reports = await getReports(context.user)
    //   if (isFeatureEnabled({ tenantId: context.user.rrTenantId }, REPORTING_CANVAS_AUTHZ)) {
    //     reports = await filterReportList(reports, context.user.id)
    //   }
    //   return reports.map(translateReportDocument)
    },
    venue: async (_, args) => {
      const { input } = args;
      return getVenue(input);
      // return findVenue(args);
    //   const results = await reportUtils.getReport(context.user, args.id)
    //   return translateReportDocument(results)
    },
  },
  Mutation: {
    createVenue: async (_, args) => {
      console.log(args);
      const { input } = args;
      return createOrUpdateVenue(input);
    //   const newReport = args
    //   const result = await reportUtils.createReport(context.user, newReport)
    //   return translateReportDocument(result)
    },
  },
}
