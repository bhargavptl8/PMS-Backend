const Client = require('../model/client');
const Project = require('../model/project');
const { checkAuthentication } = require('../services/user');

exports.createClient = async (_, args, context) => {
    await checkAuthentication(context?.token);
    let { clientName, email, phone, goldDigger } = args;
    let checkClient = await Client.findOne({ email });
    if (checkClient) {
        throw new Error("Already exists!");
    }
    await Client.create({ clientName, email, phone, goldDigger });
    return "Created successfully";
}

exports.getClients = async (_, args, context) => {
    // await checkAuthentication(context?.token);
    // let clients = await Client.find();           
    // return clients;
    await checkAuthentication(context?.token);
    const pageNumber = args.page || 1;
    const pageSize = args.limit || 10;
    const result = await Client.paginate({}, { page: pageNumber, limit: pageSize });
    const { docs: clients, totalDocs: totalData, limit, page: currentPage, totalPages } = result;
    return { clients, totalData, limit, currentPage, totalPages };
}

exports.updateClient = async (_, args, context) => {
    await checkAuthentication(context?.token);

    const { clientName, email, phone, goldDigger, clientId } = args;

    const updateFields = {};
    if (clientName) updateFields.clientName = clientName;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (goldDigger) updateFields.goldDigger = goldDigger;

    console.log("args", updateFields);

    if (email) {
        let check = await Client.findOne({ email });
        if (check) {
            throw new Error("Already exist!");
        }
    }

    let response = await Client.findByIdAndUpdate(clientId, updateFields, { new: true });
    console.log("response", response);
    return "Updated successfully";
}

exports.deleteClient = async (_, args, context) => {
    await checkAuthentication(context?.token);
    let { clientId } = args;
    // Check if the client exists
    const client = await Client.findById(clientId);
    if (!client) {
        throw new Error("Client not found!");
    }

    // Find projects associated with the client
    const associatedProjects = await Project.find({ clients: { $in: [clientId] } });

    if (associatedProjects.length > 0) {
        for (const project of associatedProjects) {
            if (project.clients.length > 1) {
                // Remove the clientId from the clients array
                project.clients = project.clients.filter(id => id.toString() !== clientId);
                await project.save();
                console.log("project==", project);
                console.log("associatedProjects==", associatedProjects);

                if (associatedProjects?.length === 1) {
                    await Client.findByIdAndDelete(clientId);
                    return `Client deleted successfully. Notify: '${project.projectName}' Project still has other clients`;
                }
                console.log(
                    `Client removed from project "${project.projectName}". Notify: Project still has other clients.`
                );
                return `Client removed from project "${project.projectName}". Notify: Project still has other clients. `;
            } else {
                // Delete the project if no other clients remain
                await Project.findByIdAndDelete(project._id);
                console.log("project", project);

                // await Client.findByIdAndDelete(clientId);
                // console.log("clientId", clientId);
                console.log(`Client deleted successfully deleted as it had only one "${project.projectName}"  project.`);
                // return `Client deleted successfully deleted as it had only one "${project.projectName}"  project.`
            }
        }
    }

    // // Delete the client
    await Client.findByIdAndDelete(clientId);

    return "Client deleted successfully.";
    // return;
    // if (!check) {
    //     throw new Error("Not found!");
    // }
    // await Client.findByIdAndDelete(clientId);
    // return "Deleted successfully";
}

exports.getClientFindById = async (clientId, context) => {
    // Use Promise.all to wait for all async operations to complete
    const clients = await Promise.all(
        clientId.map(async (id) => {
            const client = await Client.findById(id);
            if (!client) {
                return null;
            }
            return client;
        })
    );
    const validClients = clients.filter(client => client !== null);
    return validClients;
}

exports.searchClientDetails = async (_, args, context) => {
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

    // Convert the search term to a number for numeric fields, if valid
    const searchNumber = isNaN(Number(searchTerm)) ? null : Number(searchTerm);

    const searchQuery = {
        $or: [
            { clientName: { $regex: regex } },
            { email: { $regex: regex } },
            { phone: searchNumber ? { $eq: searchNumber } : undefined },
            { goldDigger: { $regex: regex } },
        ].filter(Boolean),
    };

    const result = await Client.paginate(searchQuery, { page: pageNumber, limit: pageSize });
    // console.log("result", result);
    const { docs: clients, totalDocs: totalData, limit, page: currentPage, totalPages } = result;
    return { clients, totalData, limit, currentPage, totalPages };
}
