var mongoose = require('mongoose'),
    error = require(process.cwd() + '/lib/error'),
    Schema = mongoose.Schema;

var fields = {
    user: { type: Schema.ObjectId, ref: 'User' },
    url: { type: String, default: '' },
    image: { type: String, default: 'default' },
    hostname: { type: String, default: '' },
    basicUrl: { type: String, default: '' },
    word1: { type: String, default: '' },
    word2: { type: String, default: '' },
    created: { type: Date, default: Date.now },
    result: {
        head: {
            description: { type: String, default: '' },
            doctype: { type: String, default: 'HTML' },
            charset: { type: String, default: '' },
            indexing: { type: Boolean, default: true },
            sitemap: { type: Boolean, default: false },
            robots: { type: Boolean, default: false }
        },
        body: {
            elements: {
                h1: [
                    { type: String, default: '' }
                ],
                h2: [
                    { type: String, default: '' }
                ],
                h3: [
                    { type: String, default: '' }
                ],
                h4: [
                    { type: String, default: '' }
                ],
                h5: [
                    { type: String, default: '' }
                ],
                h6: [
                    { type: String, default: '' }
                ],
                p: [
                    { type: String, default: '' }
                ]
            },
            keywordCount: {
                0: {
                    h1: { type: Number, default: 0},
                    h2: { type: Number, default: 0},
                    h3: { type: Number, default: 0},
                    h4: { type: Number, default: 0},
                    h5: { type: Number, default: 0},
                    h6: { type: Number, default: 0},
                    p: { type: Number, default: 0}
                },
                1: {
                    h1: { type: Number, default: 0},
                    h2: { type: Number, default: 0},
                    h3: { type: Number, default: 0},
                    h4: { type: Number, default: 0},
                    h5: { type: Number, default: 0},
                    h6: { type: Number, default: 0},
                    p: { type: Number, default: 0}
                }},
            images: [
                {
                    url: { type: String, default: '' },
                    slug: { type: String, default: '' },
                    alt: { type: String, default: '' }
                }
            ],
            semantics: {
                highlight: { type: Boolean, default: false },
                nestedTable: { type: Boolean, default: false },
                frame: { type: Boolean, default: false }
            },
            wordFrequency: [
                {
                    word: { type: String, default: '' },
                    count: { type: Number, default: 0}
                }
            ],
            wordCount: { type: Number, default: 0}
        },
        search: {
            indexCount: {
                seznam: { type: Number, default: 0},
                google: { type: Number, default: 0}
            },
            firstResults: {
                seznam: [
                    {
                        title: { type: String, default: '' },
                        desc: { type: String, default: '' },
                        href: { type: String, default: '' },
                        shortHref: { type: String, default: '' },
                        imgSrc: { type: String, default: '' }
                    }
                ],
                google: [
                    {
                        title: { type: String, default: '' },
                        desc: { type: String, default: '' },
                        href: { type: String, default: '' },
                        shortHref: { type: String, default: '' }
                    }
                ]
            }

        },
        links: {
            social: {
                facebook: {
                    share: { type: Number, default: 0},
                    like: { type: Number, default: 0},
                    comment: { type: Number, default: 0}
                },
                twitter: { type: Number, default: 0},
                googlePlus: { type: String, default: '0' } // 10, ale take 10k+ apod.
            },
            backlinks: {
                total: { type: Number, default: 0},
                uniqueDomain: { type: Number, default: 0},
                uniqueIP: { type: Number, default: 0},
                uniqueCsite: { type: Number, default: 0}
            },
            linkTest: [
                {
                    url: { type: String, default: '' },
                    hostname: { type: String, default: '' },
                    title: { type: String, default: '' },
                    internal: { type: Boolean, default: true },
                    follow: { type: Boolean, default: true },
                    response: { type: Number, default: 0 },
                    code: { type: String, default: 'String' } // muze byt i ERR
                }
            ]
        },
        other: {
            domainRegistered: { type: Date, default: Date.now },
            validity: {
                errors: { type: Number, default: 0 },
                warnings: { type: Number, default: 0 }
            },
            ranks: {
                srank: { type: Number, min: 0, max: 10, default: 0 },
                pageRank: { type: Number, min: 0, max: 10, default: 0 },
                alexaRankGlobal: { type: Number, default: 100000 },
                alexaRankLocal: { type: Number, default: 10000 },
                alexaRankCountry: { type: String, default: 'lok.' }
            },
            css: [
                {
                    url: String,
                    slug: String
                }
            ],
            js: [
                {
                    url: String,
                    slug: String
                }
            ]
        },
        pageSpeed: {
            desktop: {},
            mobile: {}
        }
    }
};

var TestSchema = new Schema(fields);

TestSchema.statics = {
    load: function(id, cb){
        return this.findById(id).populate('user', 'name email hashedPassword').exec(cb);
    },
    inSchema: function(arr){
        var select = arr.split(',');
        for (var i = 0; i < select.length; i++) {
            var field = select[i].replace(/^\s+|\s+$/g, '');
            if ((field != '_id') && (field != '__v')) {
                if (typeof fields[field] === 'undefined') {
                    return false;
                }
            }
        }
        return true;
    }
}

module.exports = mongoose.model('Test', TestSchema);