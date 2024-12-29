const graphQLSchema = `#graphql
    scalar Date  # Define the scalar

type User{
id:ID!,
firstName:String,
lastName:String!,
email:String!,
password:String!
}

type Client{
id:ID!,
 clientName:String!,
 email:String!,
 projects:[Project],
 phone:Int!,
 goldDigger:GoldDiggerEnum
}

type Project{
id:ID!,
projectName:String!,
language:String!,
clients:[Client!]!,
projectManager:User!,
startDate:Date,
endDate:Date,
submitDate:Date,
status:String
}

type LoginResponse{
  data:User,
  message:String!,
  token:String!
}

type PaginatedClients {
    clients: [Client]
    totalData: Int!
    limit: Int!
    currentPage: Int!
    totalPages: Int!
}

type PaginatedProjects {
    projects:[Project]
    totalData: Int!
    limit: Int!
    currentPage: Int!
    totalPages: Int!
}

type Notification {
  projects: [Project]
  manager: User!,
  managerEmail:String!,
}

enum GoldDiggerEnum {
  YES
  NO
}

type Query{
  users:[User]
  clients(page: Int, limit: Int):PaginatedClients!
  projects(page: Int, limit: Int):PaginatedProjects!
  searchClients(page: Int, limit: Int, search: String):PaginatedClients!
  searchProjects(page: Int, limit: Int, search: String):PaginatedProjects!
  notifications(managerId: ID!): [Notification]
  }


type Mutation{
    registerUser(firstName:String!,lastName:String!,email:String!,password:String!):String!
    loginUser(email:String!,password:String!):LoginResponse
    registerClient(clientName:String!, email:String!,phone:Int!,goldDigger:String!):String!
    registerProject(projectName:String!, language:String!,clients:[ID]!,projectManager:ID!,startDate:Date,endDate:Date,submitDate:Date,status:String):String!
    editClient(clientId:ID!, clientName:String, email:String,phone:Int,goldDigger:String):String!
    deleteClient(clientId:ID!):String!
    editProject(projectName:String, language:String,clients:[ID],projectManager:ID,startDate:Date,endDate:Date,submitDate:Date,status:String, projectId: ID!):String!
    deleteProject(projectId:ID!):String!
    registerNotification(projectsId: [ID], managerId:ID!, managerEmail:String! ):String!
}
`;

module.exports = graphQLSchema;