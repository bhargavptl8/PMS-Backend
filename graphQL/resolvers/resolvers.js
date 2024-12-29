const { createClient, getClients, getClientFindById, updateClient, deleteClient, searchClientDetails } = require("../../controller/client")
const { createNotifications, getNotifications } = require("../../controller/notification")
const { createProject, getProjects, getProjectFindById, updateProject, deleteProject, searchProjectDetails, getProjectFindByIdForNotification } = require("../../controller/project")
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
    deleteProject: deleteProject,
    registerNotification: createNotifications
  },
  Query: {
    users: getUsers,
    clients: getClients,
    projects: getProjects,
    searchClients: searchClientDetails,
    searchProjects: searchProjectDetails,
    notifications: getNotifications
  },
  Notification: {
    projects: async (notification, _, context) => {
      return await getProjectFindByIdForNotification(notification?.projects, context)
    },
    manager: async (notification, _, context) => {
      // return await getProjectFindByIdForNotification(notification?.projects, context)
      return await getUserFindById(notification?.manager, context)
    },
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
