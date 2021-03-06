var accessLevels = require('../../client/js/core/routingConfig').accessLevels,
    stacks = require('./controllers/stacks'),
    cards = require('./controllers/cards');
    inout = require('./controllers/inout');

module.exports = [
    //STACKS
    {
        path: '/api/exportnotes',
        httpMethod: 'GET',
        middleware: [inout.exportnotes],
        accessLevel: accessLevels.admin
    }, {
        path: '/api/notes/stacks',
        httpMethod: 'GET',
        middleware: [stacks.getall],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/stacks',
        httpMethod: 'POST',
        middleware: [stacks.post],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/stacks/:stackid',
        httpMethod: 'PUT',
        middleware: [stacks.put],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/stacks/:stackid',
        httpMethod: 'DELETE',
        middleware: [stacks.delete],
        accessLevel: accessLevels.user
    },

    //CARDS
    {
        path: '/api/notes/cards',
        httpMethod: 'GET',
        middleware: [cards.getall],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/cards/:cardid',
        httpMethod: 'GET',
        middleware: [cards.get],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/cards',
        httpMethod: 'POST',
        middleware: [cards.post],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/cards/:cardid',
        httpMethod: 'PUT',
        middleware: [cards.put],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/cards/:cardid',
        httpMethod: 'DELETE',
        middleware: [cards.delete],
        accessLevel: accessLevels.user
    },
    //Att
    {
        path: '/upload',
        httpMethod: 'POST',
        middleware: [cards.upload],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/deleteatts',
        httpMethod: 'POST',
        middleware: [cards.deleteAtts],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/addlink',
        httpMethod: 'POST',
        middleware: [cards.addLink],
        accessLevel: accessLevels.user
    }, {
        path: '/api/notes/deletelinks',
        httpMethod: 'POST',
        middleware: [cards.deleteLinks],
        accessLevel: accessLevels.user
    }
];
