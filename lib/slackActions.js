// slack actions
exports.actions = [
    { name: 'Create Channels' },
    { name: 'Delete Channel' },
    { name: 'Delete Channels' },
    { name: 'Create Groups' },
    { name: 'Invite to Group' },
    { name: 'Exit' },
];
exports.actionStrings = exports.actions.map(function(o) {
    return o.name;
});