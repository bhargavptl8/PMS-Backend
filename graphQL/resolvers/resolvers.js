const { createClient, getClients, getClientFindById, updateClient, deleteClient, searchClientDetails } = require("../../controller/client")
const { createProject, getProjects, getProjectFindById, updateProject, deleteProject, searchProjectDetails } = require("../../controller/project")
const { signup, login, getUsers, getUserFindById } = require("../../controller/user")
// const { BigIntScalar } = require("../scalars/scalars")

const garaphQLResolvers = {
  // BigInt: BigIntScalar,
  Mutation: {
    registerUser: signup,
    loginUser: login,
    registerClient: createClient,
    registerProject: createProject,
    editClient: updateClient,
    deleteClient: deleteClient,
    editProject: updateProject,
    deleteProject: deleteProject
  },
  Query: {
    users: getUsers,
    clients: getClients,
    projects: getProjects,
    searchClients: searchClientDetails,
    searchProjects: searchProjectDetails
  },
  Project: {
    projectManager: async (project, _, context) => {
      return await getUserFindById(project?.projectManager, context)
    },
    clients: async (project, _, context) => {
      return await getClientFindById(project?.clients, context)
    }
  },
  Client: {
    projects: async (client, _, context) => {
      return await getProjectFindById(client?._id, context)
    }
  }
}

module.exports = garaphQLResolvers;
