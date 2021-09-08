var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {

    getAll: function (req, res) {
        Movie.find().populate('actors').exec(function (err, movies) {
            if (err) return res.status(404).json(err);
            else{res.json(movies);}

            
        });
    },


    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        });
    },
    deleteOne: function (req, res) {
		Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
			if (err) return res.status(400).json(err);

			res.json();
		});
	},
    retrieveAll: function (req, res) {
		let year1 = req.params.year1;
		let year2 = req.params.year2;

		Movie.where("year")
			.gte(year2)
			.lte(year1)
			.exec(function (err, docs) {
				res.json(docs);
			});
	},

	deleteByDate: function (req, res) {
		let year1 = req.body.year1;
		let year2 = req.body.year2;
		Movie.deleteMany(
			{year: { $gte: year2 } },
			function (err, obj) {
				res.json(obj.result);
			}
		);
	},

	addActor: function (req, res) {
		Movie.findOne({ _id: req.params.id }, function (err, movie) {
			if (err) return res.status(400).json(err);
			if (!movie) return res.status(404).json();

			Actor.findOne({ _id: req.body.id }, function (err, actor) {
				if (err) return res.status(400).json(err);
				if (!actor) return res.status(404).json();

				// actor.movies.push(movie._id);
				movie.actors = [...movie.actors, actor._id];
				movie.save(function (err) {
					if (err) return res.status(500).json(err);

					res.json(movie);
				});
			});
		});
	},

	deleteActorById: function (req, res) {
		Movie.findOne({ _id: req.params.mid }, function (err, movie) {
			if (err) return res.status(400).json(err);
			if (!movie) return res.status(404).json();

			Actor.findOne({ _id: req.params.aid }, function (err, actor) {
				if (err) return res.status(400).json(err);
				if (!actor) return res.status(404).json();
				const index = movie.actors.indexOf(actor._id);
				movie.actors.splice(index, 1);
				movie.save(function (err) {
					if (err) return res.status(500).json(err);

					res.json(movie);
				});
			});
		});
	},
};