'use strict';

var pagination  = require('mongoose-paginate');
var paginate = require('express-paginate');
var mongoose = require(__dirname + '/index').mongoose;
var Schema = mongoose.Schema;
var ParceiroSchema = new Schema({
    nome: {
        type: String
    },
    imagem: {
        type: Object
    },
    url: {
        type: String
    },
    atuacao: {
        type: String
    },
    cadastro: {
        type: Date,
        default: Date.now
    },
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site'
    }
});

ParceiroSchema.plugin(pagination);

var Parceiro = mongoose.model('Parceiro', ParceiroSchema);

exports.list = function(req, res, callback) {
    var filter = {
        site: req.headers.authorization
    };

    Parceiro
        .paginate(filter, req.query.page, req.query.limit, function (err, pageCount, data, itemCount) {
            return callback(err, {
                object: 'list',
                has_more: paginate.hasNextPages(req)(pageCount),
                data: data,
                itemCount: itemCount,
                pageCount: pageCount
            });
        }, {sortBy: {cadastro: -1}});
};

exports.get = function(req, res, callback) {
    var id = req.params.id;

    Parceiro
        .findOne({
            _id: id,
            site: req.headers.authorization
        })
        .exec(function(err, data) {
            callback(err, data);
        });
};

exports.create = function(req, res, callback) {
    var data = req.body;

    var dados = {
        nome: data.nome,
        imagem: JSON.parse(data.imagem),
        url: data.url,
        atuacao: data.atuacao,
        cadastro: data.cadastro,
        site: req.headers.authorization
    };

    var parceiro = new Parceiro(dados);
        parceiro.save(function(err, data) {
            callback(err, data);
        });
};

exports.update = function(req, res, callback) {
    var id = req.params.id;
    var data = req.body;
    var dados = {
        nome: data.nome,
        url: data.url,
        atuacao: data.atuacao,
        cadastro: data.cadastro,
        site: req.headers.authorization
    };

    if (data.imagem) {
        dados.imagem = JSON.parse(data.imagem);
    }

    Parceiro.update({
        _id: id,
        site: req.headers.authorization
    }, dados, function(err, data) {
        callback(err, data);
    });
};

exports.remove = function(req, res, callback) {
    var id = req.params.id;

    Parceiro.remove({
        _id: id,
        site: req.headers.authorization
    }, function(err, data) {
        callback(err, data);
    });
};