const Project = require('../model/project');
const { checkAuthentication } = require('../services/user');

exports.createProject = async (_, args, context) => {
    await checkAuthentication(context?.token);
    let { projectName, language, clients, projectManager, startDate, endDate, submitDate, status } = args;
    let checkProject = await Project.findOne({ projectName });
    if (checkProject) {
        throw new Error("Already exists!");
    }
    await Project.create({ projectName, language, clients, projectManager, startDate, endDate, submitDate, status });
    return "Created successfully";
}

exports.getProjects = async (_, args, context) => {
    // await checkAuthentication(context?.token);
    // let projects = await Project.find();
    // return projects;
    await checkAuthentication(context?.token);
    const pageNumber = args.page || 1;
    const pageSize = args.limit || 10;
    const result = await Project.paginate({}, { page: pageNumber, limit: pageSize });
    const { docs: projects, totalDocs: totalData, limit, page: currentPage, totalPages } = result;
    console.log("result", result);
    return { projects, totalData, limit, currentPage, totalPages };
}

exports.updateProject = async (_, args, context) => {
    await checkAuthentication(context?.token);
    let { projectName, language, clients, projectManager, startDate, endDate, submitDate, status, projectId } = args;
    let check = await Project.findOne({ projectName });
    if (check) {
        throw new Error("Already exists!");
    }
    await Project.findByIdAndUpdate(projectId, { projectName, language, clients, projectManager, startDate, endDate, submitDate, status }, { new: true });
    return "Updated successfully";
}

exports.deleteProject = async (_, args, context) => {
    await checkAuthentication(context?.token);
    let { projectId } = args;
    let check = await Project.findOne({ _id: projectId });
    if (!check) {
        throw new Error("Not found!");
    }
    await Project.findByIdAndDelete(projectId);
    return "Deleted successfully";
}

exports.getProjectFindById = async (clientId, context) => {
    await checkAuthentication(context?.token);
    let projects = await Project.find({ clients: clientId });
    return projects;
}

exports.searchProjectDetails = async (_, args, context) => {
    // await checkAuthentication(context?.token);
    // let projects = await Project.find();
    // return projects;
    await checkAuthentication(context?.token);
    const searchTerm = args.search || '';
    const pageNumber = args.page || 1;
    const pageSize = args.limit || 10;

    // Create a regex for the search term
    const regex = new RegExp(searchTerm, 'i');
    // Define search query with `$or` operator for multiple fields

    // Define search query
    const searchQuery = {
        $or: [
            { projectName: { $regex: regex } }, // String field
            { language: { $regex: regex } }, // String field
            // { clients: { $elemMatch: { $regex: regex } } }, // Array of strings
            // { projectManager: { $regex: regex } }, // String field
            { status: { $regex: regex } }, // String field
            // Date fields: Use range comparisons instead of $regex
        ].filter(Boolean), // Remove undefined/null conditions
    };

    const result = await Project.paginate(searchQuery, { page: pageNumber, limit: pageSize });
    console.log("result", result);
    const { docs: projects, totalDocs: totalData, limit, page: currentPage, totalPages } = result;
    return { projects, totalData, limit, currentPage, totalPages };
}


