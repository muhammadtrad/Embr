const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = require('graphql');
const UserModel = require('./models/userModel');
const JobModel = require('./models/jobModel');
const Sequelize = require('sequelize');
const sequelize = require('./models/index.js');

const User = UserModel(sequelize, Sequelize);
const Job = JobModel(sequelize, Sequelize);

//Users
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    location: { type: GraphQLString },
    contact_information: { type: ContactInfo },
    about_me: { type: GraphQLString },
    applied_jobs: { type: JobType },
  }),
});

//Contact Info
const ContactInfoType = new GraphQLObjectType({
  name: 'ContactInfo',
  fields: () => ({
    email: { type: GraphQLString },
    phone_number: { type: GraphQLInt },
    linked_in_url: { type: GraphQLString },
    address: { type: GraphQLString },
  }),
});

//Job Applications
const JobType = new GraphQLObjectType({
  name: 'Job',
  fields: () => ({
    id: { type: GraphQLInt },
    user_id: { type: GraphQLInt },
    company: { type: GraphQLString },
    position: { type: GraphQLString },
    status: { type: GraphQLString },
    comments: { type: GraphQLString },
    phoneScreen: { type: GraphQLBoolean },
    interview: { type: GraphQLBoolean },
    takeHome: { type: GraphQLBoolean },
    doubleDown: { type: GraphQLBoolean },
  }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    userJobs: {
      type: new GraphQLList(JobType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parentValue, { id }) {
        const results = await Job.findAll({
          where: {
            user_id: id,
          },
        });
        return results;
      },
    },
    job: {
      type: new GraphQLList(JobType),
      args: {
        company: { type: GraphQLString },
      },
      async resolve(parentValue, { company }) {
        const results = await Job.findAll({
          where: {
            company,
          },
        });
        return results;
      },
    },
    jobs: {
      type: new GraphQLList(JobType),
      async resolve(parentValue, args) {
        const results = await Job.findAll();
        return results;
      },
    },
  },
});

//Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addJob: {
      type: JobType,
      args: {
        company: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: new GraphQLNonNull(GraphQLString) },
        user_id: { type: new GraphQLNonNull(GraphQLInt) },
        status: { type: new GraphQLNonNull(GraphQLString) },
        comments: { type: GraphQLString },
        phoneScreen: { type: GraphQLBoolean },
        interview: { type: GraphQLBoolean },
        takeHome: { type: GraphQLBoolean },
        doubleDown: { type: GraphQLBoolean },
      },
      async resolve(parentValue, args) {
        console.log(`adding job`);
        const [newJob, created] = await Job.findOrCreate({
          where: {
            company: args.company,
            position: args.position,
            user_id: args.user_id,
          },
          defaults: {
            ...args,
          },
        });
        return created ? newJob : 'Job already exists!';
      },
    },
    editJob: {
      type: JobType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        company: { type: GraphQLString },
        position: { type: GraphQLString },
        status: { type: GraphQLString },
        comments: { type: GraphQLString },
        phoneScreen: { type: GraphQLBoolean },
        interview: { type: GraphQLBoolean },
        takeHome: { type: GraphQLBoolean },
        doubleDown: { type: GraphQLBoolean },
      },
      async resolve(parentValue, args) {
        console.log('editJOB');
        const selectedJob = await Job.findOne({
          where: {
            id: args.id,
          },
        });
        let updatedRecord = Object.assign({}, args, selectedJob);
        await selectedJob.update(updatedRecord);
        return updatedRecord;
      },
    },
    deleteJob: {
      type: JobType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },

      async resolve(parentValue, args) {
        console.log(`ran`);
        const result = await Job.destroy({
          where: {
            id: args.id,
          },
        });
        return 'deleted!';
      },
    },
    deleteJobs: {
      type: new GraphQLList(JobType),
      async resolve(parentValue, args) {
        await Job.destroy({
          truncate: true,
        });
        return [];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
