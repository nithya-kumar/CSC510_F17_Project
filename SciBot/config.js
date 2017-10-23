var config = {};

config.SLACK_TOKEN = 'xoxb-258995174388-TyrBaDHWjT6YojQt4EMUvfnT';

// Message Types to be supported
config.messageType = {
    Reply : 0,
    Conversation : 1,
    Notification : 2
}

// Roles available
config.UserRoles = {
    Admin: 0,
    TeamMember: 1
}

module.exports.config = config;