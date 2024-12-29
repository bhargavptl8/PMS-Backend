const Notification = require("../model/notification");
const { checkAuthentication } = require('../services/user');
const mongoose = require('mongoose');

exports.createNotifications = async (_, args, context) => {
    await checkAuthentication(context?.token);

    let { projectsId: projects, managerId: manager, managerEmail } = args;

    // Convert the `projects` from strings to ObjectId
    let projectsObjectIds = projects.map((id) => new mongoose.Types.ObjectId(id));

    // Find existing notifications for the provided `projects`, `manager`, and `managerEmail`
    let existingNotifications = await Notification.find({
        projects: { $in: projectsObjectIds }, // Query with ObjectId
        manager,
        managerEmail,
    });

    // Extract existing `projects` from the found notifications
    let existingProjectIds = existingNotifications
        .map((notification) => notification.projects.map((proj) => proj.toString()))
        .flat();

    // Identify `projects` that do not already exist
    let newProjectsIds = projects.filter((id) => !existingProjectIds.includes(id));

    // If all `projects` already exist, throw an error
    if (newProjectsIds.length === 0) {
        throw new Error("Notifications already exist for all provided projects.");
    }

    // Convert the new project IDs to ObjectId for creation
    let newProjectsObjectIds = newProjectsIds.map((id) => new mongoose.Types.ObjectId(id));

    // Create a new notification only for the `projects` that do not already exist
    await Notification.create({
        projects: newProjectsObjectIds, // Only add the new projects
        manager,
        managerEmail,
    });

    return "Notification created successfully";
};

exports.getNotifications = async (_, args, context) => {
    await checkAuthentication(context?.token);

    let { managerId } = args;

    // Find all notifications for the given managerId
    let notifications = await Notification.find({ manager: managerId });
    // let notifications = await Notification.find({ manager: managerId }).populate(["projects","manager"]);

    // Check if any notifications exist for this manager
    if (!notifications || notifications.length === 0) {
        throw new Error("No notifications found for the given manager.");
    }

    return notifications;
}