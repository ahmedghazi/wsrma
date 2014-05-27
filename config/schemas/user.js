var mongoose = require('mongoose');
var forms = require('forms');
var Vote = require('./vote');

var User = mongoose.Schema({
    email: {
        unique: true,
        type: String,
        index: true,
        forms: {
            all: {
                type: 'email',
                validators: [forms.validators.email()]
            }
        }
    },
    title: {
        type: Number
    },
    firstname: {
        type: String,
        forms: {
            all: {
                type: 'string',
                required: true,
                validators: [
                    forms.validators.minlength(3, 'form.errors.firstname.minL'),
                    forms.validators.maxlength(50, 'form.errors.firstname.maxL')
                ]
            }
        }
    },
    lastname: {
        type: String,
        forms: {
            all: {
                type: 'string',
                required: true,
                validators: [
                    forms.validators.minlength(3, 'form.errors.lastname.minL'),
                    forms.validators.maxlength(50, 'form.errors.lastname.maxL')
                ]
            }
        }
    },
    dateOfBirth: {
        type: Date,
        forms: {
            all: {
                type: 'string',
                required: true,
                validators: [forms.validators.date('form.errors.date.format')]
            }
        }
    },
    tag: {type: String},
    optin: {type: Boolean},
    createdAt: {type: Date, default: Date.now},
    username: {
        type: String,
        default: null
    },
    instagramMediaId: {
        unique: true,
        type: String,
        default: null,
        sparse: true
    },
    instagramId: {
        unique: true,
        type: String,
        default: null,
        sparse: true,
    },
    facebookId: {
        unique: true,
        type: String,
        sparse: true,
        default: null
    },
    images: {
        low_resolution: {
            url: String,
            width: Number,
            height: Number
        },
        thumbnail: {
            url: String,
            width: Number,
            height: Number
        },
        standard_resolution: {
            url: String,
            width: Number,
            height: Number
        }
    },
    votes: [mongoose.Schema.Types.Mixed]
}, {
    versionKey: false
});
module.exports = User;