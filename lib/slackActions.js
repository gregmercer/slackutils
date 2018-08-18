// slack actions
exports.actions = [
    { name: 'Create Channels' },
    { name: 'Delete Channel' },
    { name: 'Exit' },
];
exports.actionStrings = exports.actions.map(function(o) {
    return o.name;
});